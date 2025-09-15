---
title: "Tìm hiểu FastAPI"
date: "2025-09-15"
author: "Quyền Nguyễn"
description: "Bài viết tìm hiểu về FASTAPI: từ khái niệm cơ bản, cơ chế hoạt động, thông qua một dự án cụ thể"
tags: fast-api, machine-learning, apis, python, tutorial
categories: M04W02
---

## I. Giới thiệu

Trong thế giới lập trình web hiện đại, **API (Application Programming Interface)** đóng vai trò trung gian giúp các hệ thống, dịch vụ hoặc ứng dụng giao tiếp với nhau. API chính là cầu nối giữa **frontend** (giao diện người dùng) và **backend** (xử lý logic, dữ liệu).  

Trong số các framework để xây dựng API bằng Python, **FastAPI** nổi lên nhờ:  

- **Hiệu năng cao** (dựa trên Starlette và Pydantic).  
- **Dễ học, dễ triển khai** với cú pháp gần gũi.  
- **Hỗ trợ async/await** giúp xử lý bất đồng bộ hiệu quả.  
- **Sinh tài liệu API tự động** (Swagger, ReDoc).  

Bài viết này sẽ chia sẻ cách tổ chức một dự án FastAPI chuẩn, giúp dễ mở rộng và bảo trì về sau.  

![Hình 1. Ảnh minh họa API kết nối frontend-backend](https://res.cloudinary.com/dmbfrfggz/image/upload/v1757907015/Screenshot_2025-09-15_102937_qclwx0.png)  

<!-- Hình 1. [Ảnh minh họa vai trò của API](https://www.toponseek.com/blogs/restful-api-la-gi/) -->

## II. CẤU TRÚC FASTAPI
Một dự án FastAPI điển hình có cấu trúc thư mục như sau:

```bash
project/
│── app/
│   ├── main.py
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── routers/
│   ├── services/
│   ├── db/
│   └── utils/
│
├── requirements.txt
├── .env
└── README.md
```
Dựa vào cấu trúc này chúng ta sẽ cùng nhau đi qua các thành phần cơ bản nhất của FASTAPI, thông qua một dự án nhỏ quản lí món ăn.
### 1. MAIN.PY
file **main.py** chính là nơi khởi chạy của ứng dụng FASTAPI
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.router import router
from db.database import init_db


app = FastAPI(
    title='Menu API',
)

@app.on_event('startup')
def on_startup(): init_db()


app.add_middleware(
    CORSMiddleware,
     allow_origins=["*"],      # cho phép tất cả domain
    allow_credentials=True,   # cho phép gửi cookie/auth header
    allow_methods=["*"],      # cho phép tất cả phương thức HTTP (GET, POST, PUT, DELETE, PATCH...)
)

app.include_router(router)
```
Ứng dụng FASTAPI được khởi tạo ở đây và include các router ở các thư mục khác. (router sẽ được nói ngay bên dưới). Tưởng tượng router giống như là các nhánh công ty con còn ở file main chính là tổng công ty, sẽ có nhiệm vụ quản lí hoạt động của các công ty con đó. File main.py còn là nơi khởi tạo database để lưu trữ dữ liệu.

**Middleware**  

![](https://www.redhat.com/rhdc/managed-files/Middleware-comprehensive-integration-diagram.svg)
[Link Tham Khảo: RedHat](https://www.redhat.com/en/topics/middleware/what-is-middleware)

**Middleware** là các lớp trung gian chạy **trước** và **sau** khi request được xử lý bởi route trong ứng dụng.  

Nó giống như một “bộ lọc” cho toàn bộ request/response.  

#### Cách hoạt động

1. Người dùng gửi request đến server.  
2. Request đi qua chuỗi middleware (theo thứ tự khai báo).  
3. Request đến router và được xử lý.  
4. Response trả ngược lại qua middleware.  
5. Kết quả cuối cùng gửi về client.  

**CORS (Cross-Origin Resource Sharing): cơ chế bảo mật của trình duyệt**. Mặc định một trang web chỉ được gọi API cùng origin(cùng domain + port). Nếu frontend muốn truy cập, ta sẽ cấu hình trong cors, còn các trang web khác sẽ bị chặn truy cập

**Một số tham số trong middleware**
1. allow_origins: Quy định các domain được phép gọi ("*" có nghĩa là tất cả)
2. allow_credentials: (True/False) cho phép gửi cookie, Authorization header,.. khi request
3. allow_methods: Liệt kê những phương thức HTTP cho phép (HTTP hiểu đơn giản là giao thức truyền dữ liệu giữa client đến server, một số phương thức phổ biến như GET(nhận thông tin), POST(gửi thông tin), PUT/PATCH(sửa nội dung),..)

### 2. CORE

Trong một dự án FastAPI lớn, thư mục **`core/`** thường được dùng để chứa các **cấu hình cốt lõi** và **thành phần chung** mà toàn bộ hệ thống sẽ sử dụng. Đây giống như “bộ não điều khiển” của ứng dụng.  

#### Vai trò chính của `core/`

**Cấu hình (Configuration)**  
   - Quản lý biến môi trường từ file `.env`.  
   - Tách biệt code với thông tin nhạy cảm như `SECRET_KEY`, `DATABASE_URL`.  
   - Giúp dễ dàng thay đổi khi deploy ở môi trường dev, staging, production.  

   Ví dụ: `config.py`

   ```python
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        DB_URL:str = None
        
        class Config:
            env_file = '.env'

    settings = Settings()
   ```

Khi phát triển ứng dụng, một số thông tin không được để lộ ra ngoài (password,apikey,..). Do đó biến môi trường `.env` có vai trò tách biệt các thông tin nhạy cảm ra ngoài. Ở đây class Settings sẽ đóng vai trò cấu hình, đọc các thông tin ấy vào dự án.  

**Base Settings từ pydantic**

`pydantic` là thư viện dùng để kiểm tra và ép kiểu dữ liệu (data validation & parsing) được sử dụng rộng rãi trong python.  
**Base Settings** được viết sẵn để tự động nhận giá trị từ biến môi trường, đồng thời kiểm tra dữ liệu. Nếu dữ liệu bị lỗi (không trùng khớp kiểu,..) pydantic sẽ báo ngay mà không cần người dùng lập trình lại.

**Ngoài ra, thư mục core còn chứa các phần như security (JWT Token), logging,..**

### 3. MODELS
Trong một ứng dụng FastAPI chuẩn, thư mục **`models/`** là nơi định nghĩa các **mô hình dữ liệu** dùng để ánh xạ (mapping) giữa **code Python** và **bảng trong cơ sở dữ liệu**.  

Nếu coi database là “xương sống” của ứng dụng, thì `models/` chính là **cầu nối giữa FastAPI và DB**.  

#### Vai trò chính

1. **Định nghĩa bảng (tables) trong DB**  
   - Mỗi class trong `models/` thường tương ứng với một bảng.  
   - Các thuộc tính (fields) trong class tương ứng với cột trong bảng.  

2. **ORM (Object Relational Mapping)**  
   - Thay vì viết câu lệnh SQL thủ công, bạn thao tác với object Python.  
   - Ví dụ: `session.add(User(name="Quyen"))` thay vì `INSERT INTO user...`.  

3. **Kết hợp với schemas/**  
   - `models/` dùng để lưu và truy vấn dữ liệu trong DB.  
   - `schemas/` dùng để định nghĩa dữ liệu request/response cho API.  
   - Chúng tách biệt để **tránh lộ thông tin nhạy cảm** (vd: `password_hash`).  

Tóm lại, model giúp thay thế vai trò của các bảng SQL thủ công, dễ xử lý chung với ngôn ngữ python.

```python
    
class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True, nullable=False)

    foods = relationship('Food', back_populates='category', cascade='all,delete-orphan')
```

```python
    class Food(Base):
    __tablename__ = 'foods'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True)
    cost = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), nullable=False, index=True)

    category = relationship('Category', back_populates='foods')
```

Ở đây, các bảng được kế thừa từ một class Base = declarative_base() (từ from sqlalchemy.ext.declarative import declarative_base) để báo rằng các bảng từ một database.

**Thư viện SQLAlchemy** là một thư viện ORM(Object Relational Mapper) mạnh mẽ và phổ biến nhất ở Python, cung cấp các công cụ có sẵn để thực hiện SQL trong python mà không cần viết các câu lệnh thủ công.

*Tương thích với nhiều loại database: Mysql, posgreSQL, SQLServer,..*  
*Kết hợp với Alembic để migrate hiệu quả*  

SQLAlchemy cung cấp toàn bộ mọi thứ engine(kết nối đến database), session(phiên làm việc với database), mô hình dữ liệu (tạo bảng, truy vấn,...)

### 4. SCHEMAS

Trong một ứng dụng FastAPI, thư mục **`schemas/`** là nơi định nghĩa các **mô hình dữ liệu (schemas)** bằng **Pydantic**.  
Đây là lớp trung gian giữa **client ↔ API ↔ database**.

#### Vai trò của `schemas/`

1. **Xác định cấu trúc dữ liệu request/response**  
   - Khi client gửi dữ liệu (POST/PUT), FastAPI sẽ kiểm tra dữ liệu có hợp lệ không (validate).  
   - Khi trả về dữ liệu (response), chỉ những trường được khai báo trong schema mới được hiển thị.  

2. **Bảo mật thông tin**  
   - Ví dụ: trong bảng `User` có cột `password_hash`, nhưng schema `UserRead` sẽ **không expose** trường này ra ngoài.  

3. **Tự động sinh tài liệu API**  
   - Nhờ schemas, FastAPI tự động tạo tài liệu Swagger UI đẹp và dễ dùng.  

Nói đơn giản hơn, giả sử bạn đang cần tạo một tài khoản, thì bạn phải cung cấp thông tin của bạn như mật khẩu, tên đăng nhập để quản trị viên thêm vào cơ sở dữ liệu. Nhưng khi server lấy thông tin dữ liệu của bạn để hiển thị ra ngoài, thì chỉ hiển thị tên đăng nhập chứ không hiển thị mật khẩu để tránh bị hack. Schemas chính là nơi để bạn khai báo các định dạng đầu vào, và ra giống như trường hợp trên. Nó còn có thể bổ sung các điều kiện để kiểm tra dữ liệu. Ví dụ như mật khẩu tạo ra phải ít nhất 8 chữ số chẳng hạn.

```python
from pydantic import BaseModel, Field
from typing import List, Optional

class ItemCreate(BaseModel):
    name: str = Field(..., max_length=50)   # Tên không dài quá 50 ký tự
    cost: float

class ItemRead(ItemCreate):
    id: int
    class Config:
        from_attributes = True

class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    cost: Optional[float] = None

class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=50)

class CategoryRead(CategoryCreate):
    id: int
    foods: List[ItemRead]
    class Config:
        from_attributes = True

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)

```

Ví dụ code bên trên, một Item được tạo ra(*ItemCreate*) thì phải cung cấp thông tin như tên, giá tiền, có điều kiện là độ dài tên không được quá 50 kí tự. còn đầu ra(*ItemRead*) thì sẽ có thêm phần id để hiển thị lên

#### PYDANTIC TRONG SCHEMAS
Pydantic là thư viện hỗ trợ phổ biến để tạo Schema, nó cung cấp *BaseModel* được xem như xương sống cho mọi class schema  

![](https://repository-images.githubusercontent.com/90194616/6d31d0d9-6770-4cbc-90d5-a611662126ee)

**BaseModel** giúp:

**Validation**: kiểm tra dữ liệu (kiểu, ràng buộc).

**Serialization**: chuyển object → dict/JSON.

**Parsing**: tự động ép kiểu dữ liệu.

**Config** : tùy chỉnh hành vi schema.

**Thêm Điều kiện với Field**  
Field là một hàm trợ giúp của Pydantic (giống như Column trong SQLAlchemy).

Nó cho phép bạn:

Gán giá trị mặc định.

Đặt ràng buộc (validation).

Thêm metadata (mô tả, ví dụ) → sẽ hiện trên Swagger UI của FastAPI

**Một số tham số hay dùng**  
max_length, min_length, pattern=r"^[a-z]+$" (regex)  
gt, ge, lt, le (dùng cho số)  


### 5. ROUTERS

**Routers** là nơi khai báo các **API endpoint** (đường dẫn, phương thức, dữ liệu vào/ra).  
Chúng giúp chia nhỏ ứng dụng theo **chức năng** (auth, users, todos, categories, …), giúp code **dễ đọc – dễ bảo trì – dễ mở rộng**.

**Router** chính là thứ giúp liên kết hàm python xử lí với một đường dẫn URL  
![Ảnh minh họa phân tách routers theo module](https://media2.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fz83vfznqlsqs9jg0m3jn.png)

#### Vai trò của `routers/`
1. **Tổ chức endpoint theo module**  
   - Ví dụ: `routers/auth.py`, `routers/items.py`, `routers/categories.py`.
2. **Đặt prefix & versioning**  
   - `prefix="/api/v1/items"` để quản lý version API.
3. **Gắn `tags`**  
   - Giúp nhóm endpoint trong Swagger UI.
4. **Khai báo `response_model`**  
   - Trả về đúng schema (ẩn bớt trường nhạy cảm).
5. **Dùng `Depends` cho DI (Dependency Injection)**  
   - Lấy session DB, xác thực, phân quyền, throttle/rate-limit, v.v.

**Ví dụ CRUD cơ bản**

```python
from fastapi import APIRouter, Depends, HTTPException, status, Path, Response
from sqlalchemy.orm import Session, selectinload
from db.database import get_db, SessionLocal
from models.model import Category, Food
from schemas.schema import *

router = APIRouter(prefix='/api')


# add a category into menu
@router.post('/categories/add', response_model=CategoryRead, status_code=201)
def add_category(payload:CategoryCreate, db:Session = Depends(get_db)):
    #pre-check for duplicate name
    existing = db.query(Category).filter(Category.name==payload.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Category name is already exists')
    
    category = Category(name=payload.name)
    db.add(category); db.commit(); db.refresh(category)
    return category
```


```python

# show all categories in menu
@router.get('/categories/show', response_model=List[CategoryRead], status_code=200)
def show_categories(db:Session = Depends(get_db)):
    return db.query(Category).options(selectinload(Category.foods)).all()

```

```python

@router.delete('/categories/{category_id}')
def delete_category(
    db:Session = Depends(get_db),
    category_id:int = Path(...),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail='Category not found')
    
    try:
        db.query(Food).filter(Food.category_id == category_id).delete(synchronize_session=False)
        db.delete(category)
        db.commit()
        return Response(status_code=204)
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail='Error while deleting that category')

```


```python
#New: D-Delete Food
@router.delete('/foods/{food_id}')
def delete_food(
    food_id: int = Path(...),
    db: Session = Depends(get_db)
):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Food not found')
    
    db.delete(food); db.commit();
    return Response(status_code=204)
        
```

### 6. DB
Thư mục `db/` quản lý mọi thứ liên quan cơ sở dữ liệu: kết nối, session, khởi tạo bảng, migration.
Đây là “lớp nền” để `models/`, `routers/`, `services/` thao tác dữ liệu

**Vai trò của db/**

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from core.config import settings

```

**Tạo engine**: mô tả cách kết nối DB (SQLite, Postgres, MySQL, SQL Server…).

```python
engine = create_engine(
    settings.DB_URL
)
```
Thông qua hàm create_engine của sqlalchemy, chỉ cần đưa đường dẫn của db để khởi tạo cơ sở dữ liệu (đường dẫn này thường nằm trong file môi trường để bảo mật). Do đó dễ dàng thay đôi cơ cở dữ liệu mà không ảnh hưởng đến code.

**Tạo SessionLocal & get_db():** cung cấp phiên làm việc với DB cho mỗi request.

```python
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

```
**Khai báo Base**: làm “sổ đăng ký” cho các model (metadata).
```python
Base = declarative_base()
```

**Khởi tạo DB lần đầu:**  create_all() cho demo hoặc dùng Alembic cho production.

```python
def init_db():
    Base.metadata.create_all(bind=engine)
```
### 7. CÁC THƯ MỤC KHÁC
Ở trên là toàn bộ những thư mục cần thiết của một dự án FASTAPI chuẩn chỉnh, giúp code sạch hơn và theo hướng module hóa để nâng cấp và phất triển.

Một số thành phần khác có vai trò ở logic của chương trình.

`Service/` là nơi lưu trữ các logic bussiness của chương trình

`Utils/` là nơi lưu các hàm hỗ trợ hoặc đơn giản là các thành phần không nằm vào các phần trên sẽ được đưa vào thư mục này.

## III. THỰC HÀNH DỰ ÁN
Chúng ta đã cùng tìm hiểu fastapi theo hướng từng module chức năng của nó để hiểu hơn vai trò và cách sử dụng của từng phần. Xuyên suốt phía trên, tôi có sử dụng code python mẫu trong chương trình quản lí menu nhà hàng, sau đây chúng ta sẽ cùng đi qua thành phẩm đạt được.

![API Tự động sinh tài liệu](https://res.cloudinary.com/dmbfrfggz/image/upload/v1757923230/Screenshot_2025-09-15_145807_ivgnh7.png)

![API Tự động sinh tài liệu](https://res.cloudinary.com/dmbfrfggz/image/upload/v1757923230/Screenshot_2025-09-15_145814_op4p7w.png)

Đây là tài liệu được sinh ra tự động giúp chúng ta dễ dàng truy vấn và thực hiện các câu lệnh HTTP để test chức năng ngay chính trên trình duyệt.  

**Kết hợp với FrontEnd bằng Reat**  

![](https://res.cloudinary.com/dmbfrfggz/image/upload/v1757923230/Screenshot_2025-09-15_145946_d1qeff.png)  

![](https://res.cloudinary.com/dmbfrfggz/image/upload/v1757923230/Screenshot_2025-09-15_145853_pnwcpl.png)

[Link dự án](https://github.com/QuyeN1104/RestaurantMenuWeb)

## IV. THAM KHẢO
![](https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png)  
[Tài liệu chính thức của FastAPI](https://fastapi.tiangolo.com/)

Truy cập thêm các blog mới nhất của chúng tôi, [tại đây](https://ai-blogs-seven.vercel.app/)