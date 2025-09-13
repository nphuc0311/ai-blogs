---
title: "Thuật toán Random Forest: Lý thuyết và Thực hành"
date: "2025-09-13"
author: "Phúc Nguyễn"
description: "Bài viết tìm hiểu về Random Forest: từ khái niệm cơ bản, cơ chế hoạt động, đến thực hành với bộ dữ liệu Titanic."
tags: random-forest, machine-learning, ensemble, python, tutorial
categories: M05W02
---

## I. Giới thiệu

Trong cuộc sống hằng ngày, có rất nhiều quyết định được thực hiện theo hình thức biểu quyết số đông. Các phiếu bầu có thể có tỉ lệ đóng góp như nhau, như việc bầu chọn ban cán sự trong lớp hay các chương trình bình chọn để chọn ra ca sĩ được yêu thích nhất. Nhưng cũng có thể giữa các phiếu bầu có mức độ quan trọng khác nhau.

<!-- ![Hình 1. Bầu cử Tổng Thống Mỹ 2024 với “phiếu đại cử tri” khác nhau ở mỗi bang](attachment:6da2a304-46e9-4fa5-88ea-9ad84e91fb5a:ElectoralCollege2024.svg.png) -->

Hình 1. Bầu cử Tổng Thống Mỹ 2024 với “phiếu đại cử tri” khác nhau ở mỗi bang

Trong khoa học máy tính nói chung, hay học máy nói riêng cũng tồn tại một phương pháp sử dụng ‘triết lí’ đó - đó là **phương pháp ensemble learning - tập trung nhiều mô hình để tạo ra một kết quả dự đoán tốt.**

Một trong những thuật toán điển hình của phương pháp ensemble learning - đó là thuật toán **Random Forest**, được được phát triển bởi Leo Breiman và Adele Cutler vào năm 2001, một trong những thuật toán có độ chính xác cao nhất.

Trong bài blog này, chúng ta sẽ tập trung vào tìm hiểu random forest thông qua các định nghĩa cơ bản, đi sâu vào cơ chế hoạt động và cuối cùng sẽ dùng random forest để xử lý một bài toán cụ thể…

## II. Thuật toán Random Forest

Về cơ bản, đúng như tên gọi của nó **“Forest”- một tập hợp gồm nhiều cây và mỗi cây đóng vai trò như một phiếu bầu dẫn đến kết quả cuối cùng.** Thuật toán Random Forest là một tập hợp các mô hình đơn giản hơn, đó là Decision Tree. Trong phạm vi của bài blog này, chúng ta sẽ không tập trung quá nhiều vào thuật toán cây quyết định (Decision Tree), chúng ta sẽ chỉ đi qua một số khái niệm quan trọng. Và một điểm chính khác, trong những phần sau  chúng tôi sẽ làm rõ từ **“random”** để có thể thấy yếu tố ngẫu nhiên ảnh hưởng như thế nào đối với Random Forest.

### 1. Giới thiệu Decision Tree

Giả sử bạn có dữ liệu sau

<!-- ![Hình 2 Dữ liệu Thời tiết. Nguồn: https://machinelearningcoban.com/2018/01/14/id3/#-y-tuong](attachment:adbc0218-40a5-4f63-8d74-bfe3fad7e72c:image.png) -->

Hình 2 Dữ liệu Thời tiết. Nguồn: https://machinelearningcoban.com/2018/01/14/id3/#-y-tuong

Đây là một bảng dữ liệu được sử dụng rất nhiều trong các bài giảng về decision tree. Bảng dữ liệu này mô tả mối quan hệ giữa thời tiết trong 14 ngày (bốn cột đầu, không tính cột id) và việc một đội bóng có chơi bóng hay không (cột cuối cùng). Nói cách khác, ta phải dự đoán giá trị ở cột cuối cùng nếu biết giá trị của bốn cột còn lại.

**Được rồi, giờ bạn phải tìm cách để đưa ra một quy luật để giải thích được tại sao những dữ liệu đó lại đưa ra kết quả như vậy, hay nói cách khác nếu có một dữ liệu mới, bạn phải dự đoán được kết quả sẽ là gì nếu đi theo quy luật từ 14 ngày ở trên.**

**Có thể sẽ có nhiều cách bạn nghĩ ra được, một trong số đó có thể như thế này:**

<!-- ![Hình 3 https://machinelearningcoban.com/2018/01/14/id3/#-y-tuong](attachment:c5139b32-9f5e-49cd-a6ed-1883f360e888:image.png) -->

Hình 3 https://machinelearningcoban.com/2018/01/14/id3/#-y-tuong

**Và đó chính là ý tưởng của cây quyết định, thay vì bạn phải nghĩ một cách thủ công và không có một quy luật nào thì decision tree sẽ giúp chúng ta tạo ra một quy luật để có thể dẫn đến kết quả cuối cùng một cách có logic. Do đó, khác với các thuật toán khác, decision tree giúp trực quan hóa kết quả đạt được một cách dễ hiểu và đáng tin cậy.**

#### **Cơ chế hoạt động**

Thuật toán sử dụng thuật ngữ **độ vẩn đục (impurity)** để quyết định feature nào ở ngưỡng nào sẽ được dùng để rẽ nhánh.  
Feature được chọn để phân tách là feature làm giảm vẩn đục nhiều nhất.  
Thuật toán dùng “gini” hoặc “entrophy” để định lượng hóa vấn đề, cụ thể như sau:

- **Entrophy và Information Gain**
    
    - Entropy H(S) đo lường mức độ hỗn loạn của một tập dữ liệu S:
        
        $$
        H(S) = - \sum_{c}p_c \log_{2}(p_c)
        $$
        
    - Information Gain IG(S, A) đo lường mức độ giảm Entropy khi phân tách tập S theo thuộc tính A.
        
        $$
        GG(S,A) = H(S) - \sum_{v} \frac{|S_v|}{|S|} H(S_v)
        $$
        
- **Gini Impurity & Gini Gain**
    - Gini Impurity G(S) đo xác suất phân loại sai một mẫu nếu gán nhãn ngẫu nhiên:
        
        $$
        G(S) = - \sum_{c}p_c ^ 2
        $$
        
    - Gini Gain GG(S, A) đo lường mức độ giảm Gini Impurity khi phân tách tập S theo thuộc tính A:
        
        $$
        GG(S,A) = G(S) - \sum_{v} \frac{|S_v|}{|S|} G(S_v)
        $$

#### Giải quyết ví dụ bên

Tham khảo tại: https://machinelearningcoban.com/2018/01/14/id3/#-y-tuong cách thuật toán hoạt động chi tiết.  
Cuối cùng ta được kết quả như sau:

<!-- ![Hình 4. Kết quả bài toán Nguồn: https://machinelearningcoban.com/2018/01/14/id3/#-y-tuong](attachment:92771200-3720-4584-8a1d-b87ea08e7e07:image.png) -->

Hình 4. Kết quả bài toán  
Nguồn: https://machinelearningcoban.com/2018/01/14/id3/#-y-tuong

### 2. Random Forest

- **Nhược điểm của Decision Tree**
    
    Decision Tree dễ gây overfitting và high varience vì xây dựng sơ đồ cây quá khít với tập huấn luyện. Do đó kết quả đưa ra có thể không chính xác cao.
    
    Random Forest sử dụng một tập hợp Decision Tree và yếu tố random để đưa ra kết quả cuối cùng nhầm tránh overfitting.
    
- **B1. Chuẩn bị dữ liệu**
- **Kĩ thuật Bagging**
    
    <!-- ![Hình 5 Mô hình Bagging](attachment:82b7293c-db1b-4e09-97cf-9deaae3df742:Bagging-classifier.png) -->
    
    Hình 5 Mô hình Bagging
    
    **Bagging (Bootstrap Aggregating) là một kĩ thuật random có hoàn lại các feature trong dữ liệu gốc để tạo ra một sample dữ liệu sử dụng cho từng cây quyết định riêng lẻ.**
    
    Chính nhờ yếu tố ‘random’ này, mỗi cây sẽ sử dụng một bộ dữ liệu khác nhau, điều này giúp các quyết định con độc lập nhau. Cũng chính nhờ yếu tố random mà dữ liệu huấn luyện đa dạng hơn, tránh tình trạng quá khít với dữ liệu gốc của mỗi cây quyết định.
    
- **B2. Xây dựng các cây quyết định con độc lập**
    - **Feature Randomness**
        
        Với mỗi mẫu bootstrap, để quyết định thuộc tính phân nhánh, các cây quyết định sẽ không sử dụng toàn bộ feature có trong bootstrap, thay vào đó sẽ sử dụng cơ chế là chọn ra một số lượng nhất định thuộc tính (**max_feature)** một cách random. Điều này sẽ giúp làm giảm varience cho Random Forest.
        
        - **Phát triển tối đa**
            
            Mỗi cây đóng vai trò như một week learner, được phát triển tối đa mà không cần cắt tỉa (pruning). Quá trình ở bước 3 sẽ giúp tránh overfitting.
            
- **B3. Kết hợp kết quả**
    
    Bước cuối cùng là kết hợp các dự đoán cá nhân thành một dự đoán chung. Có nhiều phương pháp kết hợp:
    
    - Voting (Bỏ phiếu)
        - Hard voting: Chọn nhãn được dự đoán nhiều nhất
        - Soft voting: Tính trung bình xác suất dự đoán
    - Weighted voting: Gán trọng số khác nhau cho các base learners dựa trên hiệu suất của chúng.

## III. Thực hành trên bộ dữ liệu Titanic

**Bộ dữ liệu được sử dụng**

[Titanic - Machine Learning from Disaster](https://www.kaggle.com/competitions/titanic/overview)

#### Import thư viện

```python
import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, FunctionTransformer
from sklearn.metrics import classification_report
```

#### Đọc dữ liệu

```python
data = pd.read_csv('/kaggle/input/titanic/train.csv')
test = pd.read_csv('/kaggle/input/titanic/test.csv')
```

#### EDA

**Sử dụng thư viện ydata-profiling**

```python
# !pip install ydata_profiling
# Profile Report
from ydata_profiling import ProfileReport
profile = ProfileReport(data, title='Data Report')

profile.to_file('report.html')
```

Khi đó ta được file html chứa thông tin về dữ liệu.

[report.html](attachment:c67568e8-5223-4117-b183-edfa0b7a71a6:report.html)

<!-- ![image.png](attachment:009073de-20f8-466f-a06a-a0c35cd6a8dc:image.png)

![image.png](attachment:f282229b-87cb-4722-b9c0-c47f702228c1:image.png)

![image.png](attachment:61f48bd5-c041-440e-a058-2e3bc5cfbdc8:image.png) -->

#### Data.info

<!-- ![image.png](attachment:582ba9b2-bc9a-42c2-a1b4-5bed597c414e:image.png) -->

#### Split dữ liêu

```python
x = data.drop(columns=['Survived'], axis=1)
y=data['Survived']

#Split into train and valid
x_train, x_val, y_train, y_val = train_test_split(x, y, test_size=0.2, random_stateXuw=11)
```

#### Xử lí dữ liệu

```python
# Preprocessing

# Tao cot IsAlone
def add_IsAlone_feature(X):
    X = X.copy()
    X['IsAlone'] = (X['SibSp'] + X['Parch'] == 0).astype(int)
    return X

def fam_feat_names(input_features):
    return list(input_features) + ['IsAlone']

feat = FunctionTransformer(
    add_IsAlone_feature,
    feature_names_out = fam_feat_names
)

# Xu li cot numeric
num_pipe = Pipeline([
    ('impute', SimpleImputer(strategy='mean')),
    ('scale', StandardScaler())
])

cat_pipe = Pipeline([
    ('impute', SimpleImputer(strategy='most_frequent')),
    ('ohe', OneHotEncoder())
])

preprocess = ColumnTransformer([
    ('num', num_pipe, ['Age', 'Fare']),
    ('cat', cat_pipe, ['Sex', 'Embarked']),
    ('raw', 'drop', ['Name', 'Ticket', 'Cabin'])
], remainder='passthrough')
```

#### Mô hình RandomForest

```python
# Model: Random Forest
rf = RandomForestClassifier(
    n_estimators=300,
    random_state=11
)

pipe = Pipeline([
    ('feat', feat),
    ('preprocess', preprocess),
    ('cls', rf)
])

pipe.fit(x_train, y_train)
y_pred = pipe.predict(x_val)
```

#### Xuất kết quả

```python
print(classification_report(y_val, y_pred))
```

<!-- ![image.png](attachment:a19fa5ae-14c7-4aeb-a4ed-94448666ea1d:image.png) -->

#### Trực quan hóa dữ liệu

<!-- ![image.png](attachment:7cb8a2fd-d29e-4673-85f2-da450a1e36b0:image.png) -->

## IV. Kết

Random Forest không chỉ là một thuật toán mạnh mẽ trong học máy, mà còn là minh chứng cho triết lý “sức mạnh đến từ tập thể”. Thay vì dựa vào một cây quyết định duy nhất dễ bị thiên lệch, Random Forest kết hợp hàng trăm, thậm chí hàng ngàn cây khác nhau để tạo ra dự đoán ổn định và chính xác hơn.

Dù vậy, Random Forest cũng không phải là “vạn năng”. Nó có thể tiêu tốn nhiều tài nguyên tính toán và khó diễn giải so với các mô hình tuyến tính. Chính vì vậy, khi áp dụng vào thực tế, bạn nên cân nhắc giữa độ chính xác, tốc độ và khả năng giải thích của mô hình.

Tóm lại, Random Forest là một lựa chọn tuyệt vời để bắt đầu giải quyết nhiều bài toán phân loại và hồi quy, đặc biệt khi dữ liệu phức tạp và nhiều nhiễu. Là tiền đề cho các phương pháp sau này như AdaBoost, Gradient Boosting,…