---
title: Tìm hiểu thuật toán LightGBM
date: "2025-09-23"
author: "Thịnh Nguyễn"
description: Giới thiệu LightGBM và cách thực hiện.
tags: Ensemble Learning, Học máy, Hồi quy, Phân loại, LightGBM
categories: M04W03
---

## 1. Giới thiệu LightGBM
- **LightGBM (Light Gradient Boosting Machine)** do Microsoft phát triển (2017) là một thư viện học máy hiệu suất cao và được thiết kế để xây dựng các mô hình cây quyết định dựa trên phương pháp boosting
- Nó là một phiên bản cải tiến của thuật toán **Gradient Boosting**, giúp tối ưu hóa tốc độ huấn luyện và giảm thiểu bộ nhớ cần thiết, đặc biệt là khi làm việc với dữ liệu lớn.
- Khác với các thuật toán boosting truyền thống, LightGBM sử dụng một cách tiếp cận có tên là **Gradient-based One-Side Sampling (GOSS)** và **Exclusive Feature Bundling (EFB)** để tăng tốc quá trình huấn luyện và giảm độ phức tạp tính toán. LightGBM có thể xử lý dữ liệu phân loại và hồi quy, đồng thời hỗ trợ nhiều loại mô hình học máy.

## 2. Điểm khác biệt giữa LightGBM so với GDBT truyền thống
- **Leaf-wise growth**: Thay vì phát triển cây theo level-wise (mở rộng đồng đều từng tầng như XGBoost), LightGBM dùng cách chọn lá có gain lớn nhất để chia gọi là leaf-wise
- **Histogram-based splitting**: Thay vì duyệt qua tất cả giá trị đặc trưng để tìm điểm chia, phương pháp này chia đặc trưng thành các bins và tính dựa trên histogram → Giảm chi phí tính toán 
- **Gradient-based One-Side Sampling (GOSS)**: Khi dữ liệu lớn, LightGBM không dùng hết toàn bộ mẫu. Ưu tiên tính trên mẫu có gradient lớn  Giúp giảm số lượng dữ liệu phải xử lý nhưng vẫn giữ chất lượng mô hình.
- **Exclusive Feature Bundling (EFB)**: Với dữ liệu thưa (sparse), nhiều đặc trưng hiếm khi đồng thời khác 0.LightGBM gom các đặc trưng này thành bundle (gộp chung vào một đặc trưng mới) → giảm số chiều.

### So sánh Gradient Boosting, XGBoost và LightGBM

| Tiêu chí | Gradient Boosting | XGBoost | LightGBM |
|----------|--------------------------------------|---------|----------|
| **Nguyên lý cơ bản** | Boosting dựa trên decision tree, thêm cây tuần tự để giảm lỗi còn lại | Cải tiến GBM, tối ưu bộ nhớ và tốc độ bằng parallel & regularization | Tiếp tục tối ưu từ XGBoost: leaf-wise growth, histogram, GOSS, EFB |
| **Cách phát triển cây** | Level-wise (mở rộng toàn bộ mức trước khi xuống mức sau) | Level-wise (nhưng có tối ưu pruning) | Leaf-wise (chọn lá có gain lớn nhất để chia) |
| **Xử lý điểm chia (split)** | Duyệt qua toàn bộ giá trị đặc trưng → chậm | Sử dụng **approximate splitting** (sort & quantile) | **Histogram-based splitting** (chia bins) → nhanh & tiết kiệm RAM |
| **Tối ưu tốc độ** | Không có cơ chế đặc biệt | Parallel learning, cache-aware, sparsity-aware | Histogram, GOSS (lấy mẫu theo gradient), EFB (gộp feature sparse) |
| **Regularization** | Chủ yếu dựa vào learning rate & tree depth | Có L1, L2 regularization trực tiếp trên leaf weights | Có L1, L2 + min_data_in_leaf để chống overfitting |
| **Hỗ trợ dữ liệu lớn** | Khó mở rộng khi data lớn | Tốt hơn GBM nhờ tối ưu bộ nhớ & song song | Rất tốt: tối ưu cho dataset cực lớn (hàng triệu mẫu, hàng ngàn đặc trưng) |
| **Tốc độ huấn luyện** | Chậm nhất | Nhanh hơn GBM truyền thống | Nhanh nhất (thường gấp nhiều lần XGBoost) |
| **Nguy cơ overfitting** | Thấp hơn (cây yếu, nông) | Trung bình (có regularization tốt) | Cao hơn nếu data nhỏ (do leaf-wise mạnh hơn level-wise) |

## 3. Thực hiện LightGBM

### Đầu vào

- Tập dữ liệu:
$$
D = \{(x_i, y_i)\}_{i=1}^N
$$

- Hàm mất mát: 
$$
L(y, \hat{y})
$$

- Số vòng lặp boosting: $T$  
- Tốc độ học: $\eta$  
- Số lá tối đa: $L_{\text{max}}$  
- Tham số GOSS: $(a, b)$  
- Số lượng bins cho histogram: $B$  
- Tham số regularization: $\lambda, \gamma$  



### Bước 0: Khởi tạo mô hình
$$
F_0(x) = \arg \min_c \sum_{i=1}^{N} L(y_i, c)
$$

### Bước 1: Tính gradient và hessian

Với mỗi mẫu $i$:
$$
g_i = \frac{\partial L(y_i, F(x_i))}{\partial F(x_i)}, \quad
h_i = \frac{\partial^2 L(y_i, F(x_i))}{\partial F(x_i)^2}
$$

### Bước 2: GOSS (Gradient-based One-Side Sampling)

- Giữ lại $a\%$ mẫu có $|g_i|$ lớn nhất  
- Lấy ngẫu nhiên $b\%$ từ phần còn lại  

Với nhóm "nhỏ", tái trọng số:
$$
g_i \gets g_i \cdot \frac{1-a}{b}, \quad
h_i \gets h_i \cdot \frac{1-a}{b}
$$

### Bước 3: Xây dựng histogram

Với mỗi đặc trưng $j$ và bin $b \in \{1, \dots, B\}$:
$$
G_{j,b} = \sum_{i \in \text{bin}(j,b)} g_i, \quad
H_{j,b} = \sum_{i \in \text{bin}(j,b)} h_i
$$

### Bước 4: Tìm điểm chia tốt nhất

Với đặc trưng $j$ và điểm chia tại bin $s$:

Gradient/Hessian bên trái:
$$
G_L = \sum_{b \le s} G_{j,b}, \quad H_L = \sum_{b \le s} H_{j,b}
$$

Gradient/Hessian bên phải:
$$
G_R = G_T - G_L, \quad H_R = H_T - H_L
$$

Độ lợi (Gain):
$$
\text{Gain} = \frac{1}{2} \left( \frac{G_L^2}{H_L + \lambda} + \frac{G_R^2}{H_R + \lambda} - \frac{G_T^2}{H_T + \lambda} \right) - \gamma
$$

Chọn split có $\text{Gain}$ lớn nhất.

### Bước 5: Phát triển cây theo leaf-wise

- Bắt đầu từ nút gốc.
- Luôn tách lá có Gain lớn nhất cho đến khi:  
$$
\text{Số lá} \ge L_{\text{max}} \quad \text{hoặc} \quad \text{Gain} < \text{threshold}
$$

### Bước 6: Gán giá trị cho lá

Với mỗi lá $l$:
$$
w_l = - \frac{\sum_{i \in l} g_i}{\sum_{i \in l} h_i + \lambda}
$$

### Bước 7: Cập nhật mô hình
$$
F(x) \gets F(x) + \eta \cdot f_t(x)
$$

### Kết quả


Sau $T$ vòng:
$$
F(x) = \sum_{t=1}^{T} \eta \cdot f_t(x)
$$


