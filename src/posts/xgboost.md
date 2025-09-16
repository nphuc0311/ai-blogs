---
title: Thuật toán XGBoost: Lý thuyết và Thực hành
date: "2025-09-15"
author: Vũ Linh
description: Bài viết tìm hiểu về XGBoost: từ khái niệm cơ bản, cơ chế hoạt động, đến thực hành với bộ dữ liệu Titanic.
tags: xgboost, gradient-boosting, ensemble, machine-learning, python, tutorial
categories: M04W02
---

## I. Giới thiệu

Nếu như Random Forest dựa trên việc kết hợp nhiều cây quyết định độc lập để giảm variance và tránh overfitting, thì **XGBoost (Extreme Gradient Boosting)** lại tiếp cận từ hướng khác: xây dựng cây một cách tuần tự, trong đó mỗi cây mới học từ sai lầm của các cây trước đó.

XGBoost được phát triển bởi Tianqi Chen và Carlos Guestrin (2016) và nhanh chóng trở thành một trong những thuật toán **state-of-the-art** trong các cuộc thi Kaggle nhờ tốc độ, độ chính xác, và khả năng mở rộng.

Thuật toán này kế thừa ý tưởng của Gradient Boosting về việc tối ưu hàm mất mát, trong đó giải quyết 2 hạn chế của Gradient Boosting:

- Tăng tốc độ huấn luyện và cải thiện scalability
- Tăng độ chính xác nhờ regularization (điều chuẩn) và tree prunning (tỉa cây) hợp lý

## II. Thuật toán XGBoost

### 1. Gradient Boosting là gì?

Khác với Random Forest (bagging), Gradient Boosting thuộc nhóm **boosting**: xây dựng tuần tự nhiều cây yếu (weak learners), trong đó mỗi cây mới tập trung vào những điểm sai của cây trước.

Ý tưởng:

- Bắt đầu với một mô hình đơn giản (ví dụ: dự đoán bằng giá trị trung bình).
- Mỗi bước, thêm một cây quyết định mới để dự đoán phần sai số (residual).
- Cập nhật mô hình tổng = mô hình trước đó + cây mới × learning rate.

### 2. Công thức cơ bản

Cho tập dữ liệu $D = \{ (x_i, y_i) \}_{i=1}^n$.

Mục tiêu: tối thiểu hóa hàm mất mát $( L )$:

$$
\hat{y}_i = \sum_{k=1}^{K} f_k(x_i), \quad f_k \in \mathcal{F}
$$

Trong đó:

* $( f_k )$: một cây quyết định
* $( \mathcal{F} )$: không gian các cây (CART)
* Hàm mất mát có thêm regularization:

$$
\begin{aligned}
    &Obj = \sum_{i=1}^n l(y_i, \hat{y_i}) + \sum_{k=1}^K \Omega(f_k) \\
    &\Omega(f) = \gamma T + \frac{1}{2}\lambda ||w||^2
\end{aligned}
$$

### 3. So sánh Gradient Boosting và XGBoost

| Tiêu chí                 | Gradient Boosting (GB - sklearn)                        | XGBoost                                                                 |
|--------------------------|--------------------------------------------------------|-------------------------------------------------------------------------|
| **Nguyên lý**            | Boosting dựa trên cây quyết định, mỗi cây mới học từ phần dư của cây trước. | Cũng dựa trên boosting, nhưng có thêm nhiều cải tiến về tốc độ và regularization. |
| **Regularization**       | Hầu như không có (dễ bị overfit).                      | Có cả L1 (`reg_alpha`) và L2 (`reg_lambda`) regularization → kiểm soát overfit tốt hơn. |
| **Xử lý missing values** | Không hỗ trợ đặc biệt, phải xử lý trước.                | Có cơ chế tự động xử lý missing value (tìm “default direction” khi split). |
| **Hiệu năng**            | Huấn luyện tuần tự, tốc độ chậm hơn.                    | Hỗ trợ song song hóa (parallel), nhanh hơn nhiều khi dữ liệu lớn.         |
| **Độ chính xác**         | Tốt với dataset nhỏ hoặc trung bình.                    | Thường nhỉnh hơn khi dữ liệu phức tạp, nhiều feature, hoặc cần regularization. |
| **Tham số**              | Ít tham số, đơn giản để thiết lập.                      | Nhiều tham số hơn (gamma, min_child_weight, subsample, colsample_bytree, …) → linh hoạt nhưng phức tạp hơn. |

### 4. So sánh Random Forest vs XGBoost

| Đặc điểm          | Random Forest      | XGBoost                       |
| ----------------- | ------------------ | ----------------------------- |
| Phương pháp       | Bagging            | Boosting                      |
| Cách xây dựng cây | Song song, độc lập | Tuần tự, phụ thuộc            |
| Regularization    | Ít                 | Có (L1, L2, Gamma)            |
| Xử lý Missing     | Cần tiền xử lý     | Tích hợp                      |
| Hiệu suất Kaggle  | Khá                | Rất cao                       |
| Tốc độ            | Nhanh (song song)  | Chậm hơn RF, nhưng tối ưu GPU |

## III. Thực hành với Titanic Dataset

**Dataset**: [Titanic - Machine Learning from Disaster](https://www.kaggle.com/competitions/titanic/overview)

Bộ dữ liệu Titanic là một trong những tập dữ liệu kinh điển trong lĩnh vực Machine Learning, gồm thông tin hành khách trên con tàu Titanic, với mục tiêu dự đoán khả năng sống sót (Survived). Các thuộc tính đáng chú ý bao gồm tuổi (Age), giới tính (Sex), hạng vé (Pclass), số người thân đi cùng (SibSp, Parch), cảng lên tàu (Embarked) cùng một số thông tin khác như tên (Name), số vé (Ticket) và cabin (Cabin).
**Tiền xử lý dữ liệu**:

* Đối với dữ liệu số (Age, Fare): thay thế giá trị khuyết bằng trung bình, sau đó chuẩn hóa bằng StandardScaler.

* Đối với dữ liệu phân loại (Sex, Embarked): thay thế giá trị khuyết bằng mode và mã hóa One-Hot.

* Các cột ít giá trị hoặc khó khai thác trực tiếp (Name, Ticket, Cabin, PassengerID) được loại bỏ.

* Ngoài ra, một đặc trưng mới IsAlone được xây dựng từ SibSp và Parch, phản ánh việc hành khách đi một mình hay đi cùng gia đình. Đây là đặc trưng có ý nghĩa vì trong thảm họa Titanic, hành khách đi cùng gia đình có cơ hội sống sót cao hơn.

### 1. Import thư viện

```python
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report

from xgboost import XGBClassifier
import matplotlib.pyplot as plt
import xgboost as xgb
```

#### Đọc dữ liệu

```python
data = pd.read_csv('/kaggle/input/titanic/train.csv')
test = pd.read_csv('/kaggle/input/titanic/test.csv')
```

```python
def add_IsAlone_feature(X):
    X = X.copy()
    X['IsAlone'] = (X['SibSp'] + X['Parch'] == 0).astype(int)
    return X

def fam_feat_names(input_features):
    return list(input_features) + ['IsAlone']

feat = FunctionTransformer(
    add_IsAlone_feature,
    feature_names_out=fam_feat_names
)
```

#### Tiền xử lý dữ liệu

```python
num_pipe = Pipeline([
    ('impute', SimpleImputer(strategy='mean')),
    ('scale', StandardScaler())
])

cat_pipe = Pipeline([
    ('impute', SimpleImputer(strategy='most_frequent')),
    ('ohe', OneHotEncoder(handle_unknown='ignore'))
])

preprocess = ColumnTransformer([
    ('num', num_pipe, ['Age', 'Fare']),
    ('cat', cat_pipe, ['Sex', 'Embarked']),
    ('drop', 'drop', ['Name', 'Ticket', 'Cabin', 'PassengerId'])
], remainder='passthrough')
```

#### Tách dữ liệu train/val

```python
X = data.drop(columns=['Survived'])
y = data['Survived']

X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=11
)
```

#### Xây dựng XGBOOST

```python
xgb_model = XGBClassifier(
    n_estimators=500,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1,
    reg_alpha=0,
    random_state=11,
    use_label_encoder=False,
    eval_metric='logloss'
)
```

#### Training

```python
pipe = Pipeline([
    ('feat', feat),
    ('preprocess', preprocess),
    ('cls', xgb_model)
])

pipe.fit(X_train, y_train)
y_pred = pipe.predict(X_val)
print(classification_report(y_val, y_pred))

preprocess = pipe.named_steps['preprocess']
feat_names = preprocess.get_feature_names_out()

feat_names = pipe.named_steps['preprocess'].get_feature_names_out(
    input_features=pipe.named_steps['feat'].get_feature_names_out(X_train.columns)
)
feat_names = list(feat_names)
# In mapping f0 -> feature
for i, name in enumerate(feat_names):
    print(f"f{i} -> {name}")

model = pipe.named_steps['cls']
model.get_booster().feature_names = feat_names

xgb.plot_importance(model, importance_type='weight')
plt.show()
```

**Kết quả và nhận xét:**

![](https://res.cloudinary.com/dwakxkmgr/image/upload/v1758010882/Screenshot_2025-09-16_152110_u9b3eq.png)
![](https://res.cloudinary.com/dwakxkmgr/image/upload/v1758009140/Screenshot_2025-09-16_145211_zwvred.png)

* Độ chính xác tổng thể đạt 88%
* Class 0 (không sống sót): Precision = 0.89, Recall = 0.93 -> mô hình dự đoán tốt nhóm này
* Class 1 (sống sót): Precision = 0.86 -> mô hình dự đoán sống sót đúng 84%, nhưng Recall = 0.79 -> bỏ sót khoảng 21% hành khách sống sót

**So sánh với Gradient boosting và Random Forest**

* Gradient boosting
![](https://res.cloudinary.com/dwakxkmgr/image/upload/v1758009990/Screenshot_2025-09-16_150618_rplv6k.png)

* Có thể thấy rằng kết quả của Gradient boosting và XGBoost không chênh lệch quá nhiều, chỉ ~ 2% và XGBoost cho kết quả tổng thể tốt hơn một chút. Điều này vì bộ dataset khá nhỏ và đơn giản nên sự vượt trội của XGBoost chưa được thể hiện nhiều vì điểm mạnh của XGBoost là trong các bài toán lớn, nhiều feature và dữ liệu phức tạp.