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

### Nhắc lại một chút về thuật toán Boosting ?

Để hiểu về Gradient Boosting, trước hết chúng ta cần nắm vững khái niệm Boosting. Boosting là một kỹ thuật học kết hợp (ensemble learning) nhằm cải thiện hiệu suất của các mô hình học máy.

Ý tưởng chính của Boosting là xây dựng một mô hình mạnh (strong learner) bằng cách kết hợp nhiều mô hình yếu (weak learners) một cách tuần tự. Mỗi mô hình yếu được thêm vào sẽ tập trung vào việc sửa chữa lỗi của các mô hình trước đó.

Hãy tưởng tượng bạn đang cố gắng giải một bài toán cực kỳ khó. Thay vì cố gắng giải nó một mình, bạn nhờ một nhóm bạn cùng giúp sức. Mỗi người bạn sẽ giải một phần của bài toán. Tuy nhiên, họ không giải độc lập mà người sau sẽ dựa vào kết quả của người trước để sửa lỗi và hoàn thiện. Cứ như vậy, qua nhiều vòng, cả nhóm sẽ tìm ra được lời giải chính xác nhất.

### Gradient Boosting

Gradient Boosting là một loại thuật toán Boosting, nhưng nó sử dụng một cách tiếp cận đặc biệt để sửa lỗi. Thay vì chỉ đơn thuần cộng thêm các mô hình yếu (weak learners), Gradient Boosting sử dụng Gradient Descent để tối ưu hóa hàm mất mát (loss function).

Gradient Descent là một thuật toán tối ưu hóa quen thuộc, dùng để tìm giá trị nhỏ nhất của một hàm số. Trong Gradient Boosting, chúng ta sẽ sử dụng nó để tìm "hướng đi" tốt nhất cho mô hình tiếp theo, sao cho nó có thể giảm thiểu lỗi của mô hình hiện tại một cách hiệu quả nhất. Về mặt lý thuyết, gradient boosting có thể được xem như một dạng gradient descent (xuống dốc theo đạo hàm) trong không gian hàm (functional gradient descent), khi mỗi bước mở rộng (boosting step) thực hiện một “bước” nhỏ hướng tới giảm thiểu hàm mất mát (loss function).

![Hình 1: Minh hoạ thuật toán Gradient Boost](https://datascience.eu/wp-content/uploads/2020/08/482246_1_En_25_Fig2_HTML-e1602896611264.png)

## 2. Cách Thức Hoạt Động của Gradient Boosting

Để hiểu rõ hơn, chúng ta hãy đi vào chi tiết các bước hoạt động của thuật toán. Ta sẽ sử dụng một ví dụ đơn giản để minh họa.

| Ngày       | Mục chi tiêu       | Số tiền (VND) | Ghi chú         |
|------------|--------------------|---------------|-----------------|
| 2025-09-01 | Ăn uống            | 200,000       | Bữa tối         |
| 2025-09-02 | Di chuyển          | 50,000        | Grab            |
| 2025-09-03 | Mua sắm            | 1,000,000     | Quần áo         |