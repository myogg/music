# GitHub Actions APK 构建配置说明

## 快速开始

您的仓库已经配置好了 GitHub Actions 工作流，只需要配置签名密钥即可自动构建 APK。

## 配置步骤

### 方案 A：使用 Debug 签名（快速测试）

如果您只是想快速构建 APK 进行测试，可以使用项目自带的 debug 签名。只需配置以下 Secrets：

访问：https://github.com/myogg/lxmusic/settings/secrets/actions

添加以下 5 个 Secrets（使用默认的 debug 配置）：

| Secret 名称 | 值 |
|-------------|-----|
| `KEYSTORE_STORE_FILE` | `debug.keystore` |
| `KEYSTORE_STORE_FILE_BASE64` | 留空（不需要） |
| `KEYSTORE_KEY_ALIAS` | `androiddebugkey` |
| `KEYSTORE_PASSWORD` | `android` |
| `KEYSTORE_KEY_PASSWORD` | `android` |

**注意：** 使用 debug 签名的 APK：
- ✅ 可以正常安装和使用
- ❌ 不能发布到应用商店
- ❌ 每次构建签名都不同，无法覆盖安装

---

### 方案 B：使用正式签名密钥（推荐用于发布）

如果您需要发布正式版本，请使用 Android Studio 生成签名密钥：

#### 1. 生成签名密钥

使用 Android Studio：

1. 打开 Android Studio
2. 菜单：Build → Generate Signed Bundle / APK
3. 选择 APK → Next
4. 点击 Create new...
5. 填写信息：
   - **Key store path**: 选择保存位置
   - **Password**: 设置密码（例如：`lxmusic2025`）
   - **Key alias**: `my-key-alias`
   - **Key password**: 设置密钥密码
   - **Validity**: 10000
   - 其他信息可选填
6. 点击 OK 生成

#### 2. 转换为 Base64

在 PowerShell 中执行：
```powershell
# 替换为您保存密钥库的路径
$keystorePath = "D:\your-path\my-release-key.keystore"
[Convert]::ToBase64String([IO.File]::ReadAllBytes($keystorePath)) | clip
```

或者保存到文件：
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("my-release-key.keystore")) > keystore-base64.txt
```

#### 3. 配置 GitHub Secrets

访问：https://github.com/myogg/lxmusic/settings/secrets/actions/new

添加以下 5 个 Secrets：

| Secret 名称 | 值 |
|-------------|-----|
| `KEYSTORE_STORE_FILE` | `my-release-key.keystore` |
| `KEYSTORE_STORE_FILE_BASE64` | （步骤2生成的Base64字符串，很长） |
| `KEYSTORE_KEY_ALIAS` | `my-key-alias` |
| `KEYSTORE_PASSWORD` | 您的密钥库密码 |
| `KEYSTORE_KEY_PASSWORD` | 您的密钥密码 |

---

## 触发构建

配置好 Secrets 后，将代码推送到 **master** 分支即可自动触发构建：

```bash
git add .
git commit -m "配置 GitHub Actions"
git push origin master
```

## 查看构建进度

访问 Actions 页面查看构建进度和日志：
https://github.com/myogg/lxmusic/actions

## 下载 APK

构建完成后，APK 会在以下位置可用：

1. **GitHub Release 页面**：https://github.com/myogg/lxmusic/releases
2. **Actions Artifacts**：在 Actions 工作流的构建详情中下载

生成的 APK 文件包括：
- `lx-music-mobile-v{版本}-arm64-v8a.apk` - 推荐：64位现代设备
- `lx-music-mobile-v{版本}-armeabi-v7a.apk` - 32位老设备
- `lx-music-mobile-v{版本}-universal.apk` - 通用版本（体积大）
- `lx-music-mobile-v{版本}-x86.apk` - x86 模拟器
- `lx-music-mobile-v{版本}-x86_64.apk` - x86_64 模拟器

## 故障排除

### 构建失败

查看 Actions 页面的详细日志，常见问题：

1. **签名配置错误**：检查 Secrets 是否正确配置
2. **依赖下载失败**：重试构建
3. **构建超时**：检查网络连接

### APK 无法安装

- 确保安装的架构与设备匹配
- 检查 Android 版本要求（Android 5+）

## 安全提示

⚠️ **重要**：
- 签名密钥库文件和密码要妥善保管
- 密钥丢失后无法更新应用
- 不要将密钥库文件提交到 Git 仓库

---

## 技术支持

如有问题，请访问：
- 项目文档：https://github.com/myogg/lxmusic
- Issues：https://github.com/myogg/lxmusic/issues
