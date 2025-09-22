---
title: "Docker: Tìm hiểu về Docker"
date: "2025-09-20"
author: "Đức Quân"
description: "Bài viết tìm hiểu về Docker: Khái niệm và các ứng dụng liên quan"
tags: docker, docker-compose, docker-swarm, container, python, tutorial
categories: M04W03
---

## I. Docker

### 1. Docker là gì?

**Docker** là nền tảng containerization, dùng để đóng gói ứng dụng và dependencies thành **images** chạy trên **containers**. Về kiến trúc:

- Container chia sẻ kernel với host nhưng tách biệt bằng **namespaces** (PID, NET, MNT, IPC, USER, UTS) và giới hạn tài nguyên bằng **cgroups**.
- Lợi ích: nhất quán môi trường (dev → staging → prod), khởi động nhanh, gọn nhẹ, dễ scale; trade-off: chia sẻ kernel → cần chú ý bảo mật kernel.
- Docker bao gồm: **Docker CLI**, **dockerd (daemon)**, **containerd (runtime)** và **runc (OCI runtime)**.

![Hình 1. Cấu trúc tổng quan Docker](https://res.cloudinary.com/dpppq2b77/image/upload/v1758529356/docker-overview_ehxhw5.png)

### 2. Cách tải Docker

**Linux (Ubuntu):**

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
# add Docker repo, key (theo hướng dẫn chính thức)
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
# cho phép chạy docker không cần sudo (logout/login)
sudo usermod -aG docker $USER
```

**macOS / Windows:** thường cài Docker Desktop (GUI + deamon) [tại đây](https://www.docker.com/get-started/). Trên WSL2 dùng backend WSL.

![Hình 2. Trang chủ cài đặt Docker](https://res.cloudinary.com/dpppq2b77/image/upload/v1758529434/docker-download_w1x6gu.png)

**Lưu ý production:** dùng repo/packaging chính thức, không tải binary không rõ nguồn; bật auto-update kernel/security patches.

### 3. Làm việc với Images

**Images** là tập các layer bất biến + metadata (Entrypoint, Env, Labels). Layer tạo bởi từng instruction Dockerfile.

**Union FS / Copy-On-Write:** overlayfs hoặc driver khác gộp các layer thành một filesystem duy nhất; khi container ghi, COW tạo layer writable.

**Dockerfile best practices:**

- Sắp xếp các bước ít thay đổi trước để tận dụng cache. Ví dụ, copy requirements trước copy source.
- Dùng multi-stage build để giảm kích thước final image.
- Tránh lưu secret trong image; dùng build args cho giá trị tạm, không commit secret lên code.

**Một số lệnh chính:**

```bash
docker build -t username/myapp:1.0 .
docker images
docker tag username/myapp:1.0 username/myapp:latest
docker push username/myapp:1.0
```

**Layer caching:** Docker tính cache theo hash của layer trước và instruction; thay file nhỏ có thể invalidate cache từ bước đó trở đi.

### 4. Làm việc với Containers

**Lifecycle:** `create` → `start` → `stop` → `rm`.

**Các lệnh hữu ích:**

```bash
docker run -d --name myapp -p 8080:80 username/myapp:1.0
docker ps -a
docker logs -f myapp
docker exec -it myapp /bin/sh
docker inspect myapp   # metadata + network + mounts
docker stop myapp && docker rm myapp
```

**Restart policies:** `--restart` (no, on-failure, always, unless-stopped) để container tự phục hồi.

**Healthchecks:** `HEALTHCHECK` trong Dockerfile hoặc compose để orchestrator biết trạng thái service.

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost/health || exit 1
```

### 5. Volums và Persistence

**Bind mounts:** gắn trực tiếp host path vào container (`-v /host/path:/container/path`). Rất linh hoạt nhưng phụ thuộc host.

**Named volumes:** Docker quản lý (`docker volume create data`), portable trong host Docker nhưng không tự động multi-node share.

**tmpfs:** in-memory ephemeral mounts.

**Volume drivers:** cho shared/remote storage (NFS, cloud block, GlusterFS). Khi deploy multi-node, phải dùng driver/solution hỗ trợ shared volume hoặc external storage (DB replication, S3, Ceph).

**Quy tắc:**

- Không lưu dữ liệu bền trong layer container (ephemeral).
- Dùng named volumes cho DB; bind mounts cho dev (live edit).
- Chú ý permission (UID/GID) khi mount từ host.

### 6. Networking trong Docker

**Driver phổ biến:**

- `bridge` (mặc định single host): container có veth pair kết nối vào bridge (docker0).
- `host`: container dùng trực tiếp mạng host (no NAT) - tốt cho performance/latency nhưng mất isolation.
- `overlay`: multi-host (Swarm hoặc compose stack) - tạo overlay network dựa trên VXLAN tunnels.
- `macvlan`: gán IP layer-2 cho container, container hiện như host trên LAN.

**Port mapping NAT**: `-p host_port:container_port` (iptables/NAT). Trên Swarm/nginx ingress thì được xử lý khác.

**Service discovery & DNS:** Docker có DNS-based service discovery; container có thể resolve `service_name` → IP/VIP.

**Security & segmentation:** tạo nhiều networks để phân vùng (frontend/backend).

## II. Docker Compose

### 1. Docker Compose là gì?

**Docker Compose** là công cụ **khai báo multiple-container application** bằng file YAML (`docker-compose.yml`). Mục tiêu:

- Tổ chức services, networks, volumes, env cho dev/local.
- Dễ khởi động toàn bộ stack bằng 1 lệnh (`docker compose up`).
- Có thể dùng file Compose để deploy stack lên orchestrator (Swarm) với `docker stack deploy` (phiên bản 3.x).

### 2. Cài đặt Docker Compose

**Thời điểm hiện tại:** Docker tích hợp Compose plugin vào CLI: `docker compose` (thay cho docker-compose Python binary). Nếu bạn dùng Docker Desktop hoặc cài `docker-ce` với `docker-compose-plugin`, sẽ có `docker compose`.
Nếu cần cài riêng (legacy), có thể cài `docker-compose` bằng pip hoặc tải binary. Nhưng khuyến nghị dùng `docker compose` plugin.

### 3. Quản lý Applications với Compose

**Cấu trúc cơ bản:**

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - redis
    environment:
      - REDIS_HOST=redis
  redis:
    image: redis:7
    volumes:
      - redis-data:/data
volumes:
  redis-data:
```

**Chỉ dẫn quan trọng:**

- `depends_on` chỉ khởi tạo thứ tự container, không đảm bảo service ready - dùng `healthcheck` để coordinate thực sự.
- `env_file` để tách biến môi trường.
- `profiles` (Compose v2+) để bật/tắt phần service theo môi trường.
- `override` files: `docker-compose.override.yml` để ghi đè config dev.

**Lệnh:**

```bash
docker compose up -d        # build + start
docker compose logs -f
docker compose down -v      # stop + remove + volumes (option)
docker compose ps
docker compose exec web sh
```

**Scaling:**

```bash
docker compose up --scale worker=3
```

**Compose vs Production:** Compose tốt cho dev và đơn giản staging. Với production scale/multi-node, dùng Swarm/Kubernetes; hoặc dùng `docker stack deploy -c docker-compose.yml`.

## III. Docker Swarm

### 1. Swarm Mode là gì?

**Docker Swarm** là orchestrator tích hợp của Docker, cho phép gom nhiều host thành 1 cluster, cung cấp các tính năng:

- Declarative service model (services, replicas).
- Scheduler, service discovery, overlay networking, routing mesh, rolling updates, secrets/configs.
- Quản lý control plane bằng Raft (managers lưu state cluster).

![Hình 3. Quan hệ Manager - Worker trong Docker](https://res.cloudinary.com/dpppq2b77/image/upload/v1758529363/Docker_Swarm_Architecture_0e7c60341e_s9z0ep.png)

### 2. Thiết lập Swarm

**Khởi tạo manager:**

```bash
docker swarm init --advertise-addr <MANAGER-IP>
# output: join tokens for worker & manager
```

**Kết nối worker:**

```bash
docker swarm join --token <WORKER-TOKEN> <MANAGER-IP>:2377
```

**Manager quorum:** nên có odd number of managers để Raft có quorum; giữ Raft log an toàn, backup `docker swarm join-token manager` nếu cần thêm manager.

### 3. Deploying services

**Tạo service:**

```bash
docker service create --name web --replicas 3 -p 80:80 nginx:stable
```

**Scale:**

```bash
docker service scale web=5
```

**Inspect:**

```bash
docker service ls
docker service ps web      # xem tasks trên nodes
docker service logs web
```

**Update/rollback:**

```bash
docker service update --image username/myapp:2.0 web
# or use deploy.update_config in compose stack to control rolling update
```

**Placement & constraints:**

```bash
docker service create --name db --constraint 'node.labels.db == true' ...
# or in compose: placement.constraints
```

### 4. Sử dụng Compose với Swarm (`docker stack deploy`)

Bạn có thể dùng file Compose (v3.x) như spec cho Swarm bằng `docker stack deploy -c stack.yml mystack`. Một số directive `deploy` chỉ có ý nghĩa trong Swarm (replicas, placement, resources).
Ví dụ `docker-stack.yml`:

```yaml
version: "3.8"
services:
  web:
    image: username/myflask:1.0
    ports:
      - target: 5000
        published: 80
        protocol: tcp
        mode: ingress
    environment:
      - REDIS_HOST=redis
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
      restart_policy:
        condition: on-failure
  redis:
    image: redis:7
    volumes:
      - redis-data:/data
    deploy:
      placement:
        constraints: [node.role == worker]
volumes:
  redis-data:
```

**Deploy:**

```bash
docker stack deploy -c docker-stack.yml mystack
docker stack services mystack
docker stack ps mystack
```

### 5. Swarm Networking & Load Balancing

**Overlay networks:** Swarm tạo overlay network giữa các node, thường implement bằng VXLAN tunnels encapsulation để chuyển layer2 qua layer3. Overlay network cho phép containers trên node khác giao tiếp như trên 1 LAN logic.

**Ingress & routing mesh:**

- **Ingress network:** khi bạn publish port `-p` cho service, Docker tạo routing mesh: bất cứ node nào nhận traffic ở port đó sẽ forward đến một task trên cluster (qua NAT/routing), đảm bảo published port có sẵn trên tất cả node (dù service không chạy local).
- **Publishing mode:** `ingress` (mặc định routing mesh) vs `host` (port bind trực tiếp trên node có task). `host` mode tránh double-hop NAT và có thể tốt cho performance.

**Service discovery & VIP:** Swarm cung cấp VIP (virtual IP) cho service: client resolve service name → VIP → traffic được LB đến các task. Ngoài ra có DNSRR mode (trả về list IPs).

**Load balancing:**

- **Internal LB:** mỗi node có proxy để LB tới các tasks.
- **External LB:** bạn có thể đặt reverse proxy (Traefik, Nginx) ngoài cluster hoặc trên node để đưa traffic vào service.

**Encrypted overlay:** Swarm hỗ trợ encrypt overlay network traffic giữa nodes (symmetric key exchange).

### 6. Secrets & Configs (Swarm)

**Secrets:** an toàn hơn env variables - được lưu encrypted in Raft, chỉ phân phối tới nodes cần thiết, mount vào container tại `/run/secrets/<name>`.

```bash
echo "mysecret" | docker secret create db_password -
# trong compose:
secrets:
  - db_password
services:
  db:
    secrets:
      - db_password
```

## IV. Thực hành - Ví dụ

**Dockerfile (ví dụ Flask):**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:5000/health || exit 1
USER 1000
CMD ["python","app.py"]
```

**docker-compose.yml (dev):**

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - redis
    environment:
      - REDIS_HOST=redis
    volumes:
      - ./app:/app
  redis:
    image: redis:7
    volumes:
      - redis-data:/data
volumes:
  redis-data:
```

## V. Tóm tắt

**Images:** small base image, multi-stage builds, tag rõ ràng (no latest in prod), sign images.

**Build:** use lockfiles, deterministic builds, cache effectively.

**Secrets:** never bake into image; use Swarm secrets / external secret manager.

**Runtime:** run as non-root user, drop capabilities, use seccomp/AppArmor profiles.

**Data:** externalize persistence (volumes, cloud storage), backup volumes.

**Networking:** segment networks (frontend/backend), avoid host mode unless necessary.

**Observability:** healthchecks, metrics endpoint, stdout/stderr logs for aggregator.

**Orchestration:** prefer declarative stacks; CI builds image → pushes registry → deploy same image everywhere.

**Swarm specifics:** keep manager quorum, backup Raft logs, use constraints/labels for placement.

## VI. Kết luận ngắn

Mục tiêu khi dockerize là **biến ứng dụng thành artifact bất biến (image)**, quản lý deployment bằng **declarative config** (Compose/Stack), và khi cần scale/multi-node dùng **orchestration** (Swarm hoặc Kubernetes). Lý thuyết là nền tảng để ra quyết định kiến trúc: networking type, storage strategy, security model, và CI/CD flow.