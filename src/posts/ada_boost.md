---
title: "AdaBoost - Các khái niệm cơ bản, nâng cao và ứng dụng"
date: "2025-09-15"
author: "Đức Quân"
description: "Bài viết tìm hiểu về AdaBoost: Từ khái niệm cơ bản đến nâng cao, và các ứng dụng"
tags: ada-boost, machine-learning, algorithm, python, tutorial
categories: M04W01
---

## I. Giới thiệu về Ensemble Learning

**Ensemble Learning** là một kỹ thuật trong học máy kết hợp nhiều mô hình "yếu" (weak learners) để tạo ra một mô hình "mạnh" (strong classifier).

![Hình 1. Kỹ thuật Ensemble Learning](https://res.cloudinary.com/dpppq2b77/image/upload/v1757992561/ensemble-learning_rildma.png)

Có ba phương pháp chính: Bagging, Boosting và Stacking.

Trong các phương pháp tiếp cận đồng nhất (homogeneous), nhiều mô hình cùng loại, như Decision Tree, được kết hợp với nhau.

![Hình 2. Bagging và Boosting](https://towardsdatascience.com/wp-content/uploads/2021/01/1zTgGBTQIMlASWm5QuS2UpA.jpeg)

## II. Kỹ thuật Boosting

**Boosting** là một kỹ thuật mô hình hóa tập hợp. Các mô hình được xây dựng nối tiếp nhau để giảm thiểu lỗi từ các mô hình trước.

Các mô hình Boosting tăng cường ảnh hưởng của các mô hình có hiệu suất cao và cố gắng xây dựng một bộ phân loại mạnh từ nhiều bộ phân loại yếu.

Các thuật toán Boosting phổ biến bao gồm Gradient Boosting và XGBoost.

![Hình 3. Kỹ thuật Boosting](https://miro.medium.com/1*4XuD6oRrgVqtaSwH-cu6SA.png)

## III. AdaBoost (Adaptive Boosting)

AdaBoost là một thuật toán Boosting sử dụng các bộ phân loại yếu, được gọi là "Stump".

Stump là một nút của cây quyết định có hai lá.

Điểm đặc biệt của AdaBoost so với Decision Tree là nó không gán trọng số bằng nhau cho các Stump trong quyết định cuối cùng. Những Stump tạo ra nhiều lỗi hơn sẽ có đóng góp ít hơn vào kết quả cuối cùng.

Thuật toán hoạt động bằng cách tăng trọng số mẫu (sample weights) của các mẫu bị phân loại sai và giảm trọng số của các mẫu được phân loại đúng. Điều này giúp các Stump tiếp theo tập trung vào việc khắc phục lỗi của các Stump trước đó.

Các cây Decision Stump chỉ có một nhánh thay vì nhiều tầng. Ở giai đoạn cuối, các Stump này được kết hợp thành một kết quả.

![Hình 4. Sự khác nhau giữa Decision Tree và Decision Stump](https://databasecamp.de/wp-content/uploads/AdaBoost-EN-e1676495751663-1320x733.png)

**Điểm mạnh:**

- **Đơn giản, dễ cài đặt:** Thuật toán AdaBoost tương đối dễ hiểu và dễ triển khai.
- **Hiệu quả cao:** Có khả năng đạt độ chính xác cao ngay cả khi sử dụng các mô hình yếu.
- **Không cần tinh chỉnh nhiều siêu tham số (hyper-parameters)**

**Điểm yếu:**

- **Nhạy cảm với nhiễu (outliers) và dữ liệu nhiễu (noisy data):** Vì AdaBoost tập trung vào các mẫu bị phân loại sai, nó rất nhạy cảm với dữ liệu nhiễu và các mẫu ngoại lai, có thể dẫn đến hiện tượng quá khớp (overfitting).
- **Chậm hơn so với các mô hình đơn lẻ:** Do là một mô hình tổ hợp, thời gian huấn luyện có thể lâu hơn.

## IV. Cách thức hoạt động của AdaBoost

**Khởi tạo:** Ban đầu, tất cả các mẫu dữ liệu đều được gán trọng số bằng nhau.

**Vòng lặp:** Với mỗi vòng lặp, một bộ phân loại yếu (ví dụ: Stump) được huấn luyện trên dữ liệu đã được gán trọng số.

**Tính toán trọng số lỗi (Error Weight):** Trọng số lỗi của bộ phân loại yếu được tính dựa trên số lượng mẫu bị phân loại sai.

**Tính toán trọng số của bộ phân loại (Stump’s Weight):** Trọng số của bộ phân loại yếu được tính bằng công thức $\alpha_m=\frac{1}{2}\ln(\frac{1-errorrate}{error rate})$. Trọng số này càng lớn khi tỉ lệ lỗi càng nhỏ.

**Cập nhật trọng số mẫu (Sample Weight):** Trọng số của các mẫu bị phân loại sai được tăng lên, còn trọng số của các mẫu phân loại đúng được giảm đi. Điều này đảm bảo rằng bộ phân loại tiếp theo sẽ tập trung hơn vào các mẫu khó.

**Kết hợp:** Quá trình này lặp lại cho đến khi đạt được số lượng bộ phân loại mong muốn hoặc tỷ lệ lỗi tổng thể đủ thấp. Cuối cùng, tất cả các bộ phân loại yếu được kết hợp lại, mỗi bộ phân loại được gán trọng số tương ứng, để đưa ra quyết định cuối cùng.

Code minh họa huấn luyện một mô hình AdaBoost:

```python
# Import các thư viện cần thiết
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. Tạo dữ liệu giả định
X, y = make_classification(n_samples=1000, n_features=20, n_informative=15, n_redundant=5, random_state=42)

# 2. Chia dữ liệu thành tập huấn luyện và tập kiểm tra
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 3. Khởi tạo và huấn luyện mô hình AdaBoost
# Sử dụng DecisionTreeClassifier (Stump) làm bộ phân loại yếu
base_classifier = DecisionTreeClassifier(max_depth=1)
# n_estimators: số lượng các bộ phân loại yếu (stumps)
# learning_rate: kiểm soát mức độ đóng góp của mỗi bộ phân loại yếu
adaboost_model = AdaBoostClassifier(estimator=base_classifier, n_estimators=50, learning_rate=1.0, random_state=42)

# Huấn luyện mô hình
adaboost_model.fit(X_train, y_train)

# 4. Đánh giá mô hình
y_pred = adaboost_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Độ chính xác của mô hình AdaBoost: {accuracy:.2f}")
```

```python
# Output:
Độ chính xác của mô hình AdaBoost: 0.84
```

## V. So sánh với Random Forest

Random Forest là một thuật toán dựa trên Bagging.

Điểm khác biệt chính là trong Random Forest, mỗi cây trong rừng đều có trọng số (votes) bằng nhau trong quyết định cuối cùng. Ngược lại, trong AdaBoost, các Stump không có trọng số bằng nhau.

Trong Random Forest, các cây được tạo ra độc lập với nhau. Trong khi đó, AdaBoost xây dựng một Stump dựa trên lỗi của các Stump trước đó.

## VI. Ứng dụng

* Phân loại email spam và email không phải spam.

* Nhận dạng khuôn mặt: Thuật toán Viola-Jones, một trong những thuật toán nhận dạng khuôn mặt cổ điển, sử dụng AdaBoost để tạo ra một bộ phân loại mạnh từ hàng nghìn bộ phân loại yếu (đặc trưng Haar). Thuật toán này có thể xác định khuôn mặt với tốc độ cực nhanh, phù hợp cho các ứng dụng thời gian thực.

* Y tế: Phân tích hình ảnh y tế (như CT scans, MRI) để phát hiện khối u hoặc các dấu hiệu bệnh lý khác. Mô hình AdaBoost có thể giúp giảm tỷ lệ dương tính giả (false-positives) và cải thiện độ chính xác trong chẩn đoán.

* Thị giác máy tính (Computer Vision): Phân loại vật thể, nhận dạng đối tượng.

* Tài chính: Dự đoán rủi ro vỡ nợ của khác hàng hoặc phát hiện các giao dịch gian lận bằng cách phân tích các điểm dữ liệu bất thường trong lịch sử giao dịch.

* An ninh mạng: Nhận dạng các mối đe dọa trong thời gian thực, giảm thiểu các cảnh bảo sai.

## VII. So sánh AdaBoost và Gradient Boosting

| Đặc điểm            | AdaBoost                                                                        | Gradient Boosting                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Cách thức hoạt động | Tăng trọng số cho các mẫu bị phân loại sai (tập trung vào các điểm dữ liệu khó) | Huấn luyện bộ phân loại mới trên phần dư lỗi (residuals) của bộ phân loại trước (tối thiểu hóa hàm mất mát)                       |
| Loại lỗi xử lý      | Dựa trên lỗi phân loại                                                          | Dựa trên hàm mất mát có thể vi phân (differential loss function)                                                                  |
| Tính linh hoạt      | Kém linh hoạt hơn, chủ yếu dùng cho bài toán phân loại nhị phân                 | Rất linh hoạt, có thể dùng cho cả bài toán phân loại và hồi quy với nhiều loại hàm mất mát khác nhau                              |
| Sự nhạy cảm         | Nhạy cảm hơn với dữ liệu nhiễu và ngoại lai vì nó tập trung vào chúng           | Thường ít nhạy cảm hơn vì nó tập trung vào việc lỗi tổng thể                                                                      |
| Sự phát triển       | Là một trong những thuật toán Boosting đầu tiên và nền tảng                     | Là một thuật toán tổng quát hơn, phát triển từ ý tưởng của AdaBoost. Các phiên bản phổ biến bao gồm XGBoost, LightGBM và CatBoost |

## VIII. Tài liệu tham khảo

![](https://databasecamp.de/wp-content/uploads/cropped-cropped-Logo.png)[Tài liệu AdaBoost của Database Camp](https://databasecamp.de/en/ml/adaboost-en)

#### Truy cập thêm các blog mới nhất của chúng tôi, [tại đây](https://ai-blogs-seven.vercel.app/)