from fastapi import FastAPI, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, Base, engine
import models, schemas
from auth import verify_password, get_password_hash, create_access_token, decode_access_token
from typing import List, Optional
from datetime import datetime
import requests

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://financestat-production-ce92.up.railway.app",  # frontend
    "https://financestat-production.up.railway.app"         # backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/")
def read_root():
    return {"message": "Finance App backend работает!"}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.login == user.login).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        login=user.login,
        hashed_password=hashed_password,
        avatar_url=user.avatar_url,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.login == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    access_token = create_access_token(data={"sub": user.login, "role": user.role, "user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Не удалось проверить токен")
    user = db.query(models.User).filter(models.User.login == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return user

@app.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/transactions", response_model=schemas.TransactionOut)
def create_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_tx = models.Transaction(
        type=tx.type,
        shift=tx.shift,
        from_currency=tx.from_currency,
        from_amount=tx.from_amount,
        to_currency=tx.to_currency,
        to_amount=tx.to_amount,
        comment=tx.comment,
        author_id=current_user.id,
        date=datetime.utcnow()
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx

@app.get("/transactions", response_model=List[schemas.TransactionOut])
def get_transactions(
    shift: Optional[int] = None,
    type: Optional[str] = None,
    comment: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Transaction)
    if shift:
        query = query.filter(models.Transaction.shift == shift)
    if type:
        query = query.filter(models.Transaction.type == type)
    if comment:
        query = query.filter(models.Transaction.comment.contains(comment))
    if from_date:
        query = query.filter(models.Transaction.date >= from_date)
    if to_date:
        query = query.filter(models.Transaction.date <= to_date)
    return query.order_by(models.Transaction.date.desc()).all()

@app.delete("/transactions/{tx_id}")
def delete_transaction(tx_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    tx = db.query(models.Transaction).filter(models.Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Операция не найдена")
    if tx.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Нет прав на удаление")
    db.delete(tx)
    db.commit()
    return {"ok": True}

@app.post("/fire", response_model=schemas.FireMessageOut)
def create_fire_message(msg: schemas.FireMessageCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_msg = models.FireMessage(
        text=msg.text,
        author_id=current_user.id,
        date=datetime.utcnow()
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@app.get("/fire", response_model=List[schemas.FireMessageOut])
def get_fire_messages(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.FireMessage).order_by(models.FireMessage.date.desc()).all()

@app.delete("/fire/{msg_id}")
def delete_fire_message(msg_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    msg = db.query(models.FireMessage).filter(models.FireMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Нет прав на удаление")
    db.delete(msg)
    db.commit()
    return {"ok": True}

@app.get("/balances")
def get_balances(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    balances = {}
    txs = db.query(models.Transaction).all()
    for tx in txs:
        if tx.from_currency:
            balances[tx.from_currency] = balances.get(tx.from_currency, 0) - (tx.from_amount or 0)
        if tx.to_currency:
            balances[tx.to_currency] = balances.get(tx.to_currency, 0) + (tx.to_amount or 0)
    return balances

@app.get("/rates")
def get_rates():
    try:
        cbr = requests.get("https://www.cbr-xml-daily.ru/daily_json.js", timeout=5).json()
        usd_rub = float(cbr["Valute"]["USD"]["Value"])
        eur_rub = float(cbr["Valute"]["EUR"]["Value"])
        cny_rub = float(cbr["Valute"]["CNY"]["Value"])
    except Exception:
        usd_rub = 90.0
        eur_rub = 100.0
        cny_rub = 12.0

    try:
        bybit = requests.get("https://api.bybit.com/v5/market/tickers?category=spot", timeout=5).json()
        bybit_list = bybit["result"]["list"]
        def get_price(symbol):
            ticker = next((t for t in bybit_list if t["symbol"] == symbol), None)
            return float(ticker["lastPrice"]) if ticker else 0

        btc_usdt = get_price("BTCUSDT")
        eth_usdt = get_price("ETHUSDT")
        usdt_usdt = 1.0
        ltc_usdt = get_price("LTCUSDT")
        bnb_usdt = get_price("BNBUSDT")
        xmr_usdt = get_price("XMRUSDT")
        sol_usdt = get_price("SOLUSDT")
        ton_usdt = get_price("TONUSDT")
        trx_usdt = get_price("TRXUSDT")
        xrp_usdt = get_price("XRPUSDT")
        doge_usdt = get_price("DOGEUSDT")
        ada_usdt = get_price("ADAUSDT")
        usdc_usdt = get_price("USDCUSDT")
        dai_usdt = get_price("DAIUSDT")
    except Exception:
        btc_usdt = eth_usdt = ltc_usdt = bnb_usdt = xmr_usdt = sol_usdt = ton_usdt = trx_usdt = xrp_usdt = doge_usdt = ada_usdt = usdc_usdt = dai_usdt = 0
        usdt_usdt = 1.0

    return {
        "RUB": {"RUB": 1},
        "USD": {"RUB": usd_rub},
        "EUR": {"RUB": eur_rub},
        "CNY": {"RUB": cny_rub},
        "USDT": {"RUB": usd_rub},
        "BTC": {"RUB": btc_usdt * usd_rub},
        "ETH": {"RUB": eth_usdt * usd_rub},
        "LTC": {"RUB": ltc_usdt * usd_rub},
        "BNB": {"RUB": bnb_usdt * usd_rub},
        "XMR": {"RUB": xmr_usdt * usd_rub},
        "SOL": {"RUB": sol_usdt * usd_rub},
        "TON": {"RUB": ton_usdt * usd_rub},
        "TRX": {"RUB": trx_usdt * usd_rub},
        "XRP": {"RUB": xrp_usdt * usd_rub},
        "DOGE": {"RUB": doge_usdt * usd_rub},
        "ADA": {"RUB": ada_usdt * usd_rub},
        "USDC": {"RUB": usdc_usdt * usd_rub},
        "DAI": {"RUB": dai_usdt * usd_rub},
    }

# --- История смен (ShiftSnapshot) ---
@app.post("/shift_snapshot", response_model=schemas.ShiftSnapshotOut)
def create_shift_snapshot(snapshot: schemas.ShiftSnapshotCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_snapshot = models.ShiftSnapshot(
        shift_number=snapshot.shift_number,
        cycle=snapshot.cycle,
        user_id=current_user.id,
        balances=snapshot.balances,
        rates=snapshot.rates
    )
    db.add(db_snapshot)
    db.commit()
    db.refresh(db_snapshot)
    return db_snapshot

@app.get("/shift_snapshot", response_model=List[schemas.ShiftSnapshotOut])
def get_shift_snapshots(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.ShiftSnapshot).filter(models.ShiftSnapshot.user_id == current_user.id).order_by(models.ShiftSnapshot.datetime.desc()).all()

# --- Синхронизация смены пользователя (shift) ---
@app.get("/user/{user_id}/shift")
def get_shift(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return {"shift": user.shift or 1}

@app.post("/user/{user_id}/shift")
def set_shift(
    user_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    user.shift = data.get("shift", 1)
    db.commit()
    return {"shift": user.shift}
