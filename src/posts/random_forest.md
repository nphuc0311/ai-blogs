---
title: "Hướng dẫn sử dụng Gradio để xây dựng ứng dụng AI tương tác"
date: "2025-09-06"
author: "Vũ Ngọc Linh"
description: "Hướng dẫn cơ bản về Gradio, một thư viện Python mã nguồn mở giúp tạo website và bản demo tương tác cho mô hình AI mà không cần nhiều kiến thức front-end."
tags: gradio, ai, python, tutorial, web
categories: M04W01
---

Gradio là một gói Python mã nguồn mở cho phép người dùng xây dựng một bản demo hoặc website tương tác cho mô hình một cách dễ dàng mà không cần nhiều kiến thức về front-end và back-end.

## I. Giới thiệu

Khi xây dựng website với Gradio cần xác định rõ 3 thành phần chính:

* **Input (Đầu vào):** Là dữ liệu người dùng nhập vào
* **Model (Mô hình):** Hàm Python nhận dữ liệu người dùng đưa vào và thực hiện dự đoán dựa trên mô hình đã được huấn luyện
* **Output (Đầu ra):** Kết quả mô hình dự đoán và được hiển thị trên website

### Input

Người dùng nhập vào có thể là nhiều kiểu dữ liệu, chia thành 4 nhóm chính:

#### 1. Dạng văn bản
```python
gr.Textbox()    # Nhập văn bản dạng chuỗi
gr.Number()     # Nhập số
gr.TextArea()   # Nhập trường văn bản
```

#### 2. Dạng tệp

```python
gr.File()    # Nhận file bất kì
gr.Image()   # Nhận file ảnh
gr.Audio()   # Nhận file âm thanh
```

#### 3. Dạng lựa chọn

```python
gr.Radio()       # Chọn một trong nhiều tuỳ chọn
gr.Dropdown()    # Chọn một trong nhiều tuỳ chọn từ menu thả xuống
gr.Slider()      # Thanh trượt cho phép kéo
```

#### 4. Dạng đa phương tiện

```python
gr.Sketchpad()    # Cho phép vẽ trực tiếp trên canvas
gr.Microphone()   # Ghi âm từ micro của người dùng
```

### Output

Output là thành phần mà Gradio hiển thị kết quả từ mô hình đã được training. Các nhóm output phổ biến:

#### 1. Dạng văn bản

* Label: Hiển thị nhãn kết quả đầu ra
* Textbox: Hiển thị văn bản kết quả

#### 2. Dạng tệp và đa phương tiện

* File: Cung cấp tệp để tải xuống
* Image: Hiển thị hình ảnh kết quả
* Video: Hiển thị video đã tải lên hoặc tạo ra
* Audio: Âm thanh đầu ra
* Gallery: Hiển thị một bộ sưu tập hình ảnh hoặc file

#### 3. Dạng dữ liệu

* Dataframe: Hiển thị dữ liệu dưới dạng bảng
* JSON: Hiển thị dữ liệu JSON được định dạng

> Lưu ý: Một số thành phần có thể hoạt động như cả input và output.

## II. Các bước khởi tạo

Gradio có 2 cách chính để xây dựng giao diện với mức độ kiểm soát khác nhau:

### 1. Interface

Là cách đơn giản và nhanh chóng nhất vì chỉ cần định nghĩa input và output cùng với hàm dự đoán là Gradio sẽ tự động tạo ra một giao diện cho người dùng có thể tương tác.

```python
import gradio as gr

def greet(name, intensity):
    return "\n".join(["Hello, " + name] * int(intensity))

demo = gr.Interface(
    fn=greet,
    inputs=["text", "slider"],
    outputs=["text"]
)

demo.launch(share=True)
```

* Hàm **`greet()`** là bộ xử lý chính.
* Input đầu vào là tên (dạng text) và 1 slider cho phép người dùng chọn lời chào được in ra bao nhiêu lần.
* Output là dạng text.

Kết quả:

![demo 1](https://res.cloudinary.com/daijlu58e/image/upload/gradio_1_htxnhu.png)

### 2. Blocks

Block cho phép sắp xếp nhiều thành phần và nhóm chúng theo bố cục tuỳ chỉnh cũng như xác định tương tác giữa chúng, vì vậy nên phức tạp hơn so với Interface.

```python
import gradio as gr

def greet(name, intensity):
    return "\n".join(["Hello, " + name] * int(intensity))

with gr.Blocks() as demo:
    name_input = gr.Textbox(label="Enter your name")
    intensity = gr.Slider(minimum=1, maximum=20, step=2)
    greet_button = gr.Button("Send hello")
    greet_output = gr.TextArea(label="Greeting")

    greet_button.click(greet, inputs=[name_input, intensity], outputs=greet_output)

demo.launch(share=True)
```
Kết quả:
![demo 2](https://res.cloudinary.com/daijlu58e/image/upload/gradio_2_kph04b.png)

Với block ta có thể sắp xếp bố cục với 2 thành phần cơ bản là **Row** và **Column**, ví dụ nếu muốn ô nhập tên và slider chọn intensity cùng 1 dòng, ta có thể viết: 

```python
import gradio as gr

def greet(name, intensity):
    return "\n".join(["Hello, " + name] * int(intensity))

with gr.Blocks() as demo:
    name_input = gr.Textbox(label="Enter your name")
    intensity = gr.Slider(minimum=1, maximum=20, step=2)
    greet_button = gr.Button("Send hello")
    greet_output = gr.TextArea(label="Greeting")

    greet_button.click(greet, inputs=[name_input, intensity], outputs=greet_output)

demo.launch(share=True)
```
Kết quả:

![demo 3](https://res.cloudinary.com/daijlu58e/image/upload/gradio_3_idbbk7.png)


Nếu muốn để input nhập tên và slider chọn intensity thành một cột và cột bên cạnh là output, ta sử dụng gr.Column(), lưu ý rằng ta cần khởi tạo gr.Row() để chứa các cột muốn xếp thành một hàng trước nếu không mỗi cột sẽ một hàng và không khác biệt gì so với gr.Row().

```python
import gradio as gr

def greet(name, intensity):
    return "\n".join(["Hello, "+name]*int(intensity))

with gr.Blocks() as demo:
    with gr.Row():
        with gr.Column():
            name_input = gr.Textbox(label="Enter your name")
            intensity = gr.Slider(label="Intensity", minimum=1, maximum=20, step=2)
        with gr.Column():
            greet_button = gr.Button("Send hello")
            greet_output = gr.TextArea(label="Greeting")

    greet_button.click(greet, inputs=[name_input, intensity], outputs=greet_output)

demo.launch(share=True)
```

Kết quả:

![demo 4](https://res.cloudinary.com/daijlu58e/image/upload/gradio_4_hdxobh.png)


## III. Triển khai Image Segmentation với U-net bằng Gradio

Mình tiến hành cài đặt mô hình U-net trên tập dữ liệu **Oxford-iiit-pet** và lưu mô hình tại **model.pth** và sử dụng Gradio để tạo giao diện.

```python
import gradio as gr
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
import time
import os
import tempfile

from model.unet import UNET
from config import DEVICE

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "model.pth")

def load_model():
    model = UNET().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    return model

model = load_model()

def preprocess(image):
    transform = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0).to(DEVICE)

def predict(image):
    with torch.no_grad():
        start = time.time()
        input_tensor = preprocess(image)
        output = model(input_tensor)
        pred = torch.argmax(output, dim=1).squeeze(0).cpu().numpy()
        end = time.time()
    return pred, end - start

def mask_to_grayscale(mask):
    gray_values = np.array([0, 127, 255], dtype=np.uint8)
    gray_mask = gray_values[mask]
    return Image.fromarray(gray_mask)

def process_image(uploaded_image):
    if uploaded_image is None:
        return None, "No image uploaded", None
    
    seg_mask, proc_time = predict(uploaded_image)
    result = mask_to_grayscale(seg_mask)

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    result.save(temp_file, format="PNG")
    temp_file.close()

    return result, f"Processing time: {proc_time:.2f} seconds", temp_file.name

with gr.Blocks() as demo:
    gr.Markdown("## Pet Image Segmentation Web (Gradio)")
    
    with gr.Row():
        with gr.Column():
            inp = gr.Image(type="pil", label="Upload an image")
            btn = gr.Button("Process Image")
        with gr.Column():
            out_img = gr.Image(type="pil", label="Segmented Output")
            out_text = gr.Textbox(label="Info", interactive=False)
            out_file = gr.File(label="Download Result")
    
    btn.click(fn=process_image, inputs=inp, outputs=[out_img, out_text, out_file])

if __name__ == "__main__":
    demo.launch(share=True)
```

Link triển khai web trên HuggingFace Spaces: [Pet Segmentation Gradio](https://huggingface.co/spaces/vngclinh/pet-segmentation-gradio)
![demo 5](https://res.cloudinary.com/daijlu58e/image/upload/gradio_5_ghtxzq.png)

Demo kết quả:

![demo 6](https://res.cloudinary.com/daijlu58e/image/upload/gradio_6_q0gewg.png)

### Giải thích các thành phần Gradio

* **`gr.Blocks()`**: Đây là container chính trong Gradio, cho phép bạn thiết kế giao diện web theo dạng khối (blocks).
* **`gr.Markdown()`**: Hiển thị tiêu đề hoặc văn bản trên giao diện bằng Markdown, ở đây dùng để đặt tên ứng dụng.
* **`gr.Row()` và `gr.Column()`**: Sắp xếp phần tử theo hàng hoặc cột
* **`gr.Image(type="pil")`**: Upload/hiển thị ảnh dưới dạng PIL, `label` dùng để hiển thị tên trên giao diện.
* **`gr.Button()`**: Tạo nút bấm để gọi hàm xử lý, ở đây hàm `process_image` sẽ được gọi.
* **`gr.Textbox(interactive=False)`**: Hiển thị thông tin không chỉnh sửa được.
* **`gr.File()`**: Cho phép tải file kết quả.
* **`btn.click(fn=..., inputs=..., outputs=...)`**: Event binding khi người dùng nhấn nút.
* **`demo.launch(share=True)`**: Chạy ứng dụng với link public tạm thời.