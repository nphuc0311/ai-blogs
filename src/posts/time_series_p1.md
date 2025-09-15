---
title: "Tìm hiểu Time-Series Data"
date: "2025-09-15"
author: "Thịnh Nguyễn"
description: "Blog tìm hiểu về khái niệm, đặc trưng, đặc tính thống kê, model trong dữ liệu time-series"
tags: time-series
categories: M04W01
---

## I. Khái niệm & đặc trưng của dữ liệu time series

Time series là dữ liệu quan sát có thứ tự thời gian không thể suffle như tabular data

**Một vài loại dữ liệu time series**

* Univariate time series
* Multivariate time series
* Multiple series

**Các đặc trưng quan trọng**

* Trend: Xu hướng dài hạn
* Seasonality: Chu kỳ lặp lại
* Residual: Phần ngẫu nhiên
* Ví dụ:
    
![](https://res.cloudinary.com/dsikxgkcg/image/upload/v1757944532/image_pknmeo.png)
    
**Data partioning**

* Expanding window
* Rolling window

## II. Một số bài toán với time series

### Forecasting

**Mục tiêu:** Dự đoán giá trị trong tương lai dựa trên các quan sát trong quá khứ.

**Ví dụ:** Dự báo thời tiết, dự báo nhu cầu điện, dự báo lưu lượng giao thông, …

### Imputation

**Mục tiêu**: Điền vào các điểm dữ liệu bị thiếu trong chuỗi thời gian.

**Ví dụ**: Một số cảm biến đo đạc bị mất tín hiệu, ta cần ước lượng giá trị thiếu để phân tích tiếp, …

### Anomaly detection

**Mục tiêu**: Xác định những điểm hay mẫu dữ liệu khác biệt rõ rệt so với hành vi thông thường.

**Ví dụ**: **Ví dụ**: Phát hiện lỗi trong sản xuất công nghiệp, tấn công mạng, bất thường trong giao dịch tài chính.

### Classification

**Mục tiêu**: Gán nhãn chuỗi thời gian vào một lớp đã định sẵn.

**Ví dụ**: Nhận diện hành động từ cảm biến, chẩn đoán nhịp tim, …

## III. Data generation

**Basic approaches**

* Homogeneous scailing
* Rotation
* Jittering
* Magenitude warping
* Time warping
* Permutation
* Window warping
* Time slicing window
* Concatenating resampling
* Channel permutation

**Decomposition**

* Additive: $X = S + T + R$
* Multiplicative: $X = S x T x R$

## IV. Data valuation

**Data valuation dùng để**

* Hiểu dữ liệu: Xem phân phối các giá trị thống kê (mean, median, min, max, IQR, ...)
* Phát hiện bất thường / lỗi dữ liệu: Giúp xử lí missing value, smoothing hay giữ nguyên để làm anomaly detection.
* Xác định tính chất của dữ liệu time-series: Có trend không?, có seasonality không?
* Chọn cách chuẩn hóa và biến đổi dữ liệu.
* Đánh giá dữ liệu cho mô hình: Nếu dữ liệu nhiều nhiễu, ít xu hướng, khó dự đoán -> mô hình khó học. Nếu dữ liệu rõ trend, seasonality -> Dễ xây dựng model tốt 

**Các phương pháp đánh giá dữ liệu**

* Statistical Properties: Đánh giá dựa trên các giá trị thống kê
* Nhược điểm: Không khai thác được đặt trưng của chuỗi thời gian
* Time Series Characteristics: Đánh giá dựa trên trend, seasonality, variance theo thời gian, residuals, transitions

## V. Model

**Phân loại theo IO Shape**

* Short-term
* Long-term

**Phân loại theo IO Type**

* Deterministic / Point Forecasting: Dự đoán ra một giá trị cụ thể
* Probabilistic Forecasting: Dự báo ra một khoảng có xác suất

**Phân loại theo Method**

* Recursive: Dự đoán 1 bước, đưa kết quả dự đoán để dự báo bước tiếp theo
* Direct: Dự báo nhiều bước cùng lúc

**Phân loại theo kiến trúc**

* MLP-based
* RNN-based
* CNN-based
* TCN
* Transformer-based
* Foundational Models cho dữ liệu Time Series

**Channel Strategies**

* Channel-Independent: Huấn luyện mỗi kênh riêng biệt
* Channel-Dependent: Huấn luyện chung nhiều kênh, khai thác quan hệ
* Channel-Clustering: Kết hợp, để cân bằng giữa capacity và robustness

**Multu-Scale Models**

* Học cùng lúc coarse-grained patterns (xu hướng dài hạn) và fine-grained patterns (dao động ngắn hạn)

## VI. Learning Paradigm

* Self-Supervised Learning: Tự học cấu trúc dữ liệu mà không cần nhãn thủ công.
* Generative-based: Sinh dữ liệu mới, dự báo hoặc tái tạo dữ liệu.
* Adversarial-based: Sử dụng GAN cho Time Series.
* Contrastive-based: Học representation bằng so sánh cặp dữ liệu.
* Federater Learning: Cho phép nhiều nguồn dữ liệu cùng huấn luyện một mô hình mà không cần chia sẻ dữ liệu gốc.