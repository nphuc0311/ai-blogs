---
title: Gradient Boosting
date: "2025-09-14"
author: "Nguyen Dinh Phuc"
description: " "
tags: Ensemble learning
categories: M04W02
---

Gradient Boosting là một thuật toán mạnh mẽ không thể bỏ qua trong các bài toán xử lý dữ liệu dạng bảng. Với khả năng khám phá các quan hệ phi tuyến phức tạp, nó hoàn toàn giải quyết được các vấn đề phổ biến trong các kiểu dữ liệu dạng bảng như giá trị thiếu, ngoại lai hay dữ liệu phân loại có nhiều giá trị.

Bài viết này sẽ cung cấp cho bạn cái nhìn sâu sắc về Gradient Boosting, giúp bạn không chỉ biết cách sử dụng mà còn hiểu được tại sao nó lại hiệu quả đến vậy. Khi đã nắm vững nguyên lý, bạn sẽ có đủ kiến thức để tinh chỉnh siêu tham số, tùy chỉnh hàm lỗi, từ đó nâng cao đáng kể chất lượng mô hình của mình.

## 1. Giới thiệu

### Nhắc lại một chút về thuật toán Boosting

Để hiểu về Gradient Boosting, trước hết chúng ta cần nắm vững khái niệm Boosting. Boosting là một kỹ thuật học kết hợp (ensemble learning) nhằm cải thiện hiệu suất của các mô hình học máy.

Ý tưởng chính của Boosting là xây dựng một mô hình mạnh (strong learner) bằng cách kết hợp nhiều mô hình yếu (weak learners) một cách tuần tự. Mỗi mô hình yếu được thêm vào sẽ tập trung vào việc sửa chữa lỗi của các mô hình trước đó.

Hãy tưởng tượng bạn đang cố gắng giải một bài toán cực kỳ khó. Thay vì cố gắng giải nó một mình, bạn nhờ một nhóm bạn cùng giúp sức. Mỗi người bạn sẽ giải một phần của bài toán. Tuy nhiên, họ không giải độc lập mà người sau sẽ dựa vào kết quả của người trước để sửa lỗi và hoàn thiện. Cứ như vậy, qua nhiều vòng, cả nhóm sẽ tìm ra được lời giải chính xác nhất.

### Gradient Boosting

Gradient Boosting là một loại thuật toán Boosting, nhưng nó sử dụng một cách tiếp cận đặc biệt để sửa lỗi. Thay vì chỉ đơn thuần cộng thêm các mô hình yếu (weak learners), Gradient Boosting sử dụng Gradient Descent để tối ưu hóa hàm mất mát (loss function).

Gradient Descent là một thuật toán tối ưu hóa quen thuộc, dùng để tìm giá trị nhỏ nhất của một hàm số. Trong Gradient Boosting, chúng ta sẽ sử dụng nó để tìm "hướng đi" tốt nhất cho mô hình tiếp theo, sao cho nó có thể giảm thiểu lỗi của mô hình hiện tại một cách hiệu quả nhất. Về mặt lý thuyết, gradient boosting có thể được xem như một dạng gradient descent (xuống dốc theo đạo hàm) trong không gian hàm (functional gradient descent), khi mỗi bước mở rộng (boosting step) thực hiện một “bước” nhỏ hướng tới giảm thiểu hàm mất mát (loss function).

![Hình 1: Minh hoạ thuật toán Gradient Boost](https://datascience.eu/wp-content/uploads/2020/08/482246_1_En_25_Fig2_HTML-e1602896611264.png)

## 2. Cách thức hoạt động của Gradient Boosting
Cho tập huấn luyện $\{(x_i, y_i)\}_{i=1}^n$, hàm mất mát $L(y, F(x))$ và số vòng lặp (số cây) $M$. Gradient Boosting xây dựng mô hình theo các bước sau:

#### Bước 1: Khởi tạo mô hình ban đầu $F_{0}(x)$ sao cho tối thiểu hóa hàm mất mát trên toàn bộ dữ liệu.
$$
F_{0}(x) = \arg\min_\gamma \sum_{i=1}^n L(y_i, \gamma)
$$

#### Bước 2: Lặp từ $m = 1 \to M$:
* Tính "phần dư" (Residuals):
$$
r_{im} = - \left[ \frac{\partial L(y_i, F(x_i))}{\partial F(x_i)} \right]_{F(x)=F_{m-1}(x)} \text{for } i = 1, ..., n
$$

* Huấn luyện mô hình mới: Tìm đạo hàm âm của hàm mất mát tại dự đoán hiện tại $F_{m-1}$

* Tìm hệ số bước $\gamma_{m}$:
$$
\gamma_m = \arg\min_\gamma \sum_{i=1}^n L \big( y_i, F_{m-1}(x_i) + \gamma h_m(x_i) \big)
$$

* Cập nhật mô hình:
$$
F_m(x) = F_{m-1}(x) + \gamma_m h_m(x)
$$

#### Bước 3: Sau $M$ vòng lặp, kết quả dự đoán chính là kết quả đầu ra của mô hình cuối cùng $F_{M}(x)$

Chắc hẳn khi nhìn vào các công thức trên, sẽ có nhiều bạn cảm thấy khó hiểu. Để cho dễ hình dung, mình sẽ sử dụng một ví dụ minh hoạ đơn giản và thực hiện lại các bước tính toán của thuật toán nhé!

Cho tập dữ liệu thể hiện giá của một căn nhà dựa vào diện tích như sau:

| Diện tích (x) | Giá nhà (y) |
|---------------|-------------|
| 100           | 1.5         |
| 120           | 1.8         |
| 150           | 2.5         |
| 180           | 2.0         |
| 200           | 2.2         |

### Khởi tạo mô hình

Chúng ta khởi tạo mô hình ban đầu $F_{0}(x)$ bằng cách lấy giá trị trung bình của tất cả các giá nhà trong tập dữ liệu.
$$
F_{0}(x) = \text{average}(y) = \frac{1.5 + 1.8 + 2.5 + 2.0 + 2.2}{5} = 2.0
$$
Đây là mô hình dự đoán ban đầu của chúng ta, nghĩa là với mọi giá trị đầu vào $x$, mô hình sẽ luôn dự đoán $y = 2$

### Tính "phần dư" (Residuals)

Residuals $r_{i}$ là lỗi của mô hình hiện tại. Nó được tính bằng cách lấy giá trị thực $y_i$ trừ đi giá trị dự đoán $F_{0}(x)$.
$$
r_{1} = y_1 - F_{0}(x)
$$

Lúc này, từ bảng dữ liệu huấn luyện ban đầu ta có:

| Diện tích (x) | Giá nhà (y) | Dự đoán $F_{0}$ | Residuals $r_{1}$        |
|---------------|-------------|-----------------|--------------------------|
| 100           | 1.5         | 2.0             | -0.5                     |
| 120           | 1.8         | 2.0             | -0.2                     |
| 150           | 2.5         | 2.0             | 0.5                      |
| 180           | 2.0         | 2.0             | 0.0                      |
| 200           | 2.2         | 2.0             | 0.2                      |

Các giá trị residuals chính là mục tiêu mà mô hình kế tiếp cần phải học. Thay vì dự đoán giá nhà, mô hình kế tiếp sẽ dự đoán các giá trị residuals này. Khi đó, đến một mô hình $m$ nào đó thì chênh lệch giữa giá trị dự đoán từ mô hình và giá trị thực sự sẽ là nhỏ nhất.

### Huấn luyện và cập nhập mô hình

Chúng ta huấn luyện một cây quyết định mới $h_{1}(x)$ trên tập dữ liệu với giá trị residuals $r_{1}$ là mục tiêu. Cây quyết định này sẽ học cách dự đoán lỗi của mô hình trước đó. Giả sử sau huấn luyện ta thu được kết quả như sau:

| Diện tích (x) | Dự đoán Residual $h_{1}(x)$ |
|---------------|-----------------------------|
| 100           | -0.4                        |
| 120           | -0.2                        |
| 150           | 0.5                         |
| 180           | 0.0                         |
| 200           | 0.2                         |

Giả sử chúng ta chọn learning rate $\alpha = 0.3$, mô hình tổng thể sẽ được cập nhập bằng cách thêm mô hình mới vào.
$$
\begin{aligned}
    F_{1}(x) &= F_{0}(x) + \alpha h_{1}(x) \\
    F_{1}(100) &= F_{0}(100) + \alpha h_{1}(100) \\
    F_{1}{100} &= 2.0 + 0.1 \times (-0.4) = 1.68
\end{aligned}
$$
Sau khi cập nhập mô hình ta có:

| Diện tích (x) | Giá nhà (y) | Dự đoán $F_{0}$ | Dự đoán $F_{1}$ |
|---------------|-------------|-----------------|-----------------|
| 100           | 1.5         | 2.0             | 1.88            |
| 120           | 1.8         | 2.0             | 1.94            |
| 150           | 2.5         | 2.0             | 2.15            |
| 180           | 2.0         | 2.0             | 2.0             |
| 200           | 2.2         | 2.0             | 2.06            |

> Nhận xét: Các giá trị dự đoán $F_{1}$ của mô hình đã gần hơn so với giá trị thực $y$. Quá trình này sẽ được lặp lại $M$ lần (tương ướng với $M$ cây)

Qua ví dụ trên các bạn chắc hẳn cũng đã phần nào hiểu hơn về cơ chế hoạt động của thuật toán Gradient Boosting. Nhưng các bạn có thắc mắc tại sao giá trị khởi tạo mô hình $F_0$ lại là giá trị trung bình của tập đầu vào $x$ hay tại sao lại phải nhân thêm một tham số $\alpha$ ở trong bước cập nhập mô hình không ? Chúng ta sẽ cùng nhau trả lời những câu hỏi trên nhé!

### Hàm mất mát Mean Squared Error (MSE)
MSE là một hàm mất mát phổ biến cho bài toán hồi quy, có dạng:

$$
L(y,F(x)) = \frac{1}{n} \sum_{i=1}^{n}(y_i - F(x))^2
$$

Lấy đạo hàm theo $F(x)$ ta có:

$$
\nabla_{F(x)} L(y_i, F(x)) 
= \frac{\partial}{\partial F(x)} 2(y_i - F(x))^{2} 
= -(y_i - F(x)) \text{ for } i = 1, ..., n
$$

Chúng ta tạm thời không quan tâm đến giá trị 2 trong hàm trên vì đây là một hằng số, mục tiêu của chúng ta là sẽ tối thiểu hoá hàm mất mát này để sai số giữa giá trị dự đoán và gia trị thực là nhỏ nhất. Chính vì vậy, để tìm cực tiểu của một hàm số, ta cần đi theo hướng ngược lại của đạo hàm.

$$
-\nabla_{F(x)} L(y_i, F(x)) = -(-(y_i - F(x))) = y_i - F(x) \text{ for } i = 1, ..., n
$$

Đây chính xác là công thức tính residual mà chúng ta đã sử dụng!

Vì vậy, việc huấn luyện cây quyết định mới trên residual thực chất là xấp xỉ (approximate) cực tiểu của hàm mất mát. Cây quyết định này sẽ giúp chúng ta tìm "hướng đi" tốt nhất để cập nhật mô hình, sao cho hàm mất mát được giảm xuống.

Nhưng tại sao giá trị khởi đầu lại là giá trị trung bình ? Khi khởi tạo mô hình, mục tiêu của chúng ta là tìm một hằng số $F(x)$ sao cho hàm mất mát được tối thiểu hóa. Và để tìm giá trị tối ưu $F(x)$, chúng ta chỉ việc đặt giá trị đạo hàm bằng 0.

$$
\nabla_{F(x)} L(y, F(x)) = -2\frac{1}{n} \sum_{i=1}^{n}(y_i - F(x)) = 0 \\
\sum_{i=1}^{n}(y_i - F(x)) = 0 \\
\sum_{i=1}^{n}y_i - \sum_{i=1}^{n}F(x) = 0 \\
\sum_{i=1}^{n}y_i - nF(x) = 0 \\
\sum_{i=1}^{n}y_i = nF(x) \\
F(x) = \frac{1}{n}\sum_{i=1}^{n}y_i
$$

Từ biểu thức trên, chúng ta thấy rằng giá trị $F(x)$ tối ưu chính là giá trị trung bình của $y$. Do đó, việc khởi tạo mô hình bằng giá trị trung bình của $y$ đảm bảo rằng chúng ta bắt đầu từ một điểm tối ưu, nơi hàm mất mát đã ở mức thấp nhất có thể với một hằng số duy nhất.

### Tốc độ học learning rate

Nếu chúng ta cộng trực tiếp giá trị dự đoán của cây mới vào mô hình, mỗi cây sẽ có ảnh hưởng rất lớn và mạnh mẽ. Điều này có thể khiến mô hình hội tụ quá nhanh, dẫn đến tình trạng mô hình quá khớp (overfitting) và không ổn định. Bằng cách nhân với một giá trị learning rate nhỏ, chúng ta đảm bảo rằng đóng góp của mỗi cây mới chỉ là một phần nhỏ. Điều này tạo ra một quá trình học từ tốn và cẩn thận hơn, giúp ngăn chặn mô hình bị quá khớp (overfitting) và cải thiện khả năng tổng quát hóa của nó trên dữ liệu mới.

## 3. Gradient Boosting cho bài toán Phân loại

Trong bài toán phân loại, ý tưởng cốt lõi của Gradient Boosting vẫn tương tự như trong hồi quy: xây dựng mô hình mạnh từ các mô hình yếu một cách tuần tự, tập trung vào việc sửa chữa lỗi của các mô hình trước đó. Tuy nhiên, có một vài thay đổi quan trọng:

* **Hàm mất mát:** Chúng ta không sử dụng MSE nữa. Thay vào đó, chúng ta sẽ sử dụng các hàm mất mát phù hợp với bài toán phân loại, chẳng hạn như Binary Cross-Entropy (đối với bài toán phân loại nhị phân) hoặc Categorical Cross-Entropy (đối với bài toán đa lớp).

* **Residual (Phần dư):** Thay vì residual trực tiếp, chúng ta sẽ sử dụng pseudo-residual, là gradient âm của hàm mất mát. Cây quyết định mới sẽ học cách dự đoán các giá trị này.

* **Dự đoán:** Mô hình sẽ dự đoán log-odds hoặc xác suất, thay vì giá trị thực. Sau đó, chúng ta sẽ sử dụng các hàm chuyển đổi như Sigmoid hoặc Softmax để biến đổi thành xác suất cuối cùng.

Tương tụ như bài toán hồi quy, mình cũng sẽ sử dụng một ví dụ minh hoạ đơn giản và thực hiện lại các bước tính toán của thuật toán để có thể dễ dàng hình dung nhất nhé!

Giả sử chúng ta cần dự đoán một khách hàng có mua sản phẩm hay không (có = 1, không = 0) dựa trên số lần truy cập website.

| Số lần truy cập (x) | Mua hàng (y) |
|---------------------|--------------|
| 10                  | 1            |
| 15                  | 0            |
| 20                  | 1            |
| 25                  | 0            |
| 30                  | 1            |

### Khởi tạo mô hình cho bài toán

Chúng ta khởi tạo mô hình ban đầu $F_0(x)$ bằng cách lấy giá trị log-odds. Với $\hat{p}$ là xác suất của lớp 1 (khách hàng mua hàng). Trong ví dụ này, có 3 người mua hàng trong tổng số 5 người, nên $\hat{p} = \frac{3}{5}$

$$
\begin{aligned}
    \text{odds} = \frac{\hat{p}}{1 - \hat{p}}
    = \frac{\frac{3}{5}}{1 - \frac{3}{5}}
    = 1.5 \\

    F_0(x) = \log(\text{odds}) 
    = \log(1.5)
    \approx 0.405
\end{aligned}
$$

Đây là giá trị dự đoán ban đầu của chúng ta trên thang log-odds.

### Tính toán Pseudo-Residual

Vì đây là bài toán phân loại nhị phân nền chúng ta sẽ sử dụng Binary Cross-Entropy làm hàm mất mát, có dạng:
$$
L(y, \hat{y}) = -[y \log(\hat{y}) + (1 - y) \log(1 - \hat{y})]
$$

Pseudo-Residual $r_i$ là gradient âm của hàm mất mát nên ta có:

$$
\frac{\partial L}{\partial F_0} = y_i - \text{Sigmoid}(F_0(x_i))
$$

Trong đó, $\text{Sigmoid}(F_0(x_i))$ là hàm chuyển đổi từ log-odds sang xác suất. Chúng ta tính xác suất dự đoán ban đầu $\hat{p_0}$ và pseudo-residual cho từng khách hàng:

$$
\hat{p_0} = \text{Sigmoid}(F_0(x_i)) = \text{Sigmoid}(0.405) \approx 0.6
$$

Lúc này, ta có bảng dữ liệu sau:

| Số lần truy cập (x) | Mua hàng (y) | Dự đoán log-odds $F_0(x)$ | Dự đoán xác suất $\hat{p_0}$ | Pseudo-Residual $r_1$ |
|---------------------|--------------|---------------------------|------------------------------|-----------------------|
| 10                  | 1            | 0.405                     | 0.6                           | 0.4                  |
| 15                  | 0            | 0.405                     | 0.6                           | -0.6                 |
| 20                  | 1            | 0.405                     | 0.6                           | 0.4                  |
| 25                  | 0            | 0.405                     | 0.6                           | -0.6                 |
| 30                  | 1            | 0.405                     | 0.6                           | 0.4                  |

Các giá trị pseudo-residual này chính là "mục tiêu" mới mà cây quyết định tiếp theo cần học.







