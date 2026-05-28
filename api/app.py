from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import threading

# Pequeno backend para autenticação e armazenamento de inspeções

BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, 'data.json')
_lock = threading.Lock()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _read_data():
    if not os.path.exists(DATA_FILE):
        return {"users": [], "inspections": []}
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def _write_data(data):
    with _lock:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


class LoginRequest(BaseModel):
    username: str
    password: str


class Inspection(BaseModel):
    id: str = None
    date: str = None
    client: dict
    vehicle: dict


@app.post('/api/login')
def login(payload: LoginRequest):
    data = _read_data()
    users = data.get('users', [])
    for u in users:
        if u.get('username') == payload.username and u.get('password') == payload.password:
            return {"user": payload.username}
    raise HTTPException(status_code=401, detail='Credenciais inválidas')


@app.get('/api/inspections')
def list_inspections():
    data = _read_data()
    return {"inspections": data.get('inspections', [])}


@app.post('/api/inspections')
def add_inspection(item: Inspection):
    data = _read_data()
    inspections = data.get('inspections', [])
    ins = item.dict()
    if not ins.get('id'):
        ins['id'] = f"insp-{int(__import__('time').time()*1000)}"
    inspections = [i for i in inspections if i.get('id') != ins['id']]
    inspections.insert(0, ins)
    data['inspections'] = inspections
    _write_data(data)
    return {"inspection": ins}


@app.delete('/api/inspections/{ins_id}')
def delete_inspection(ins_id: str):
    data = _read_data()
    inspections = data.get('inspections', [])
    new = [i for i in inspections if i.get('id') != ins_id]
    if len(new) == len(inspections):
        raise HTTPException(status_code=404, detail='Não encontrado')
    data['inspections'] = new
    _write_data(data)
    return {"status": "ok"}
