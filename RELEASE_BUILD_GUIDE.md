# lx-music-mobile 正式版打包完整流程

## 📋 概览

本文档详细记录了 lx-music-mobile 项目从开发环境到生成正式 Release APK 的完整流程，包括签名配置、构建过程和安装部署。

## 🔧 前置环境要求

### 必需软件
- **Node.js**: v16+ 
- **JDK**: 17 或 11
- **Android SDK**: API Level 21-35
- **Android NDK**: 26.1.10909125
- **Gradle**: 8.8 (自动下载)

### 环境变量配置
```powershell
# 避免中文路径问题
$env:GRADLE_USER_HOME="D:\tools\Pycharm\PycharmWork\lx-music-mobile\.gradle_home"
$env:TEMP="D:\Temp"
$env:TMP="D:\Temp"
```

## 🚀 完整构建流程

### 步骤 1: 生成签名密钥（首次）

**目的**: 创建用于签名正式版本的密钥库文件

```powershell
# 进入 app 目录
cd D:\tools\Pycharm\PycharmWork\lx-music-mobile\android\app

# 生成密钥库
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**交互过程**:
1. 输入密钥库口令（例如: `duoo2025`）
2. 再次确认密码
3. 填写证书信息（可直接回车跳过）：
   - 姓名
   - 组织单位
   - 组织名称  
   - 城市或地区名称
   - 州或省份名称
   - 国家/地区代码
4. 确认信息正确（输入 `是` 或 `yes`）

**重要提示**:
- ⚠️ **密码必须妥善保管**，丢失后无法更新应用
- 💾 **密钥库文件不能丢失**，建议备份到安全位置
- 🔒 **不要将密钥库和密码提交到版本控制系统**

### 步骤 2: 配置签名属性文件

**目的**: 创建构建脚本使用的签名配置文件

在 `android/` 目录创建 `keystore.properties` 文件：

```properties
storeFile=my-release-key.keystore
storePassword=duoo2025
keyAlias=my-key-alias
keyPassword=duoo2025
```

**PowerShell 命令创建**:
```powershell
cd D:\tools\Pycharm\PycharmWork\lx-music-mobile\android

"storeFile=my-release-key.keystore`nstorePassword=duoo2025`nkeyAlias=my-key-alias`nkeyPassword=duoo2025" | Out-File -FilePath "keystore.properties" -Encoding ASCII -NoNewline
```

**安全配置**:
```powershell
# 确保敏感文件不被提交到 Git
echo "android/keystore.properties" >> .gitignore
echo "*.keystore" >> .gitignore
```

### 步骤 3: 构建 Release APK

**目的**: 编译、优化并签名生成正式版本 APK

```powershell
# 设置环境变量
cd D:\tools\Pycharm\PycharmWork\lx-music-mobile
$env:GRADLE_USER_HOME="$PWD\.gradle_home"

# 进入 Android 目录
cd android

# 清理并构建 Release 版本
.\gradlew.bat clean assembleRelease
```

**构建过程详解**:

1. **配置阶段 (0-5%)**:
   - 读取项目配置
   - 解析依赖关系
   - 配置构建任务

2. **JS Bundle 创建 (6-15%)**:
   - 使用 Metro 打包 JavaScript 代码
   - 压缩和优化 JS 资源
   - 生成 assets 文件

3. **依赖下载 (16-30%)**:
   - 下载 React Native 运行时库
   - 下载 Hermes 引擎
   - 下载第三方依赖包

4. **原生代码编译 (31-70%)**:
   - 编译 Java/Kotlin 代码
   - 编译 C++ 原生模块 (NDK)
   - 处理资源文件

5. **签名和优化 (71-100%)**:
   - 使用 R8 进行代码混淆和优化
   - 应用签名配置
   - 生成最终 APK 文件

**预期构建时间**: 4-8分钟（取决于硬件性能）

### 步骤 4: 验证构建结果

**生成文件位置**:
```
android/app/build/outputs/apk/release/
```

**生成的 APK 文件**:
- `lx-music-mobile-v1.8.0-arm64-v8a.apk` - **推荐**: 现代 Android 设备 (64位)
- `lx-music-mobile-v1.8.0-armeabi-v7a.apk` - 老旧 Android 设备 (32位)
- `lx-music-mobile-v1.8.0-universal.apk` - 通用版本（包含所有架构，体积大）
- `lx-music-mobile-v1.8.0-x86.apk` - x86 模拟器用
- `lx-music-mobile-v1.8.0-x86_64.apk` - x86_64 模拟器用

**验证签名**:
```powershell
# 验证 APK 签名信息
keytool -printcert -jarfile android/app/build/outputs/apk/release/lx-music-mobile-v1.8.0-arm64-v8a.apk
```

### 步骤 5: 安装部署

#### 方式 A: USB 直接安装（推荐）

```powershell
# 检查连接设备
adb devices

# 安装到设备（选择合适的架构）
adb install android/app/build/outputs/apk/release/lx-music-mobile-v1.8.0-arm64-v8a.apk
```

#### 方式 B: 手动传输安装

1. 将 APK 文件复制到手机存储
2. 在手机文件管理器中找到 APK 文件
3. 点击安装（需要允许未知来源安装）

## 📊 架构选择指南

| 架构 | 适用设备 | 推荐程度 | 说明 |
|------|----------|----------|------|
| **arm64-v8a** | 现代 Android 手机（2015年后） | ⭐⭐⭐⭐⭐ | 64位，性能最佳 |
| armeabi-v7a | 老旧 Android 手机（2015年前） | ⭐⭐⭐ | 32位，兼容性好 |
| universal | 所有 Android 设备 | ⭐⭐⭐⭐ | 通用但体积大 |
| x86/x86_64 | Android 模拟器 | ⭐⭐ | 仅用于开发测试 |

**发布建议**:
- **个人使用**: 选择 `arm64-v8a` 版本
- **广泛分发**: 使用 `universal` 版本
- **应用商店**: 同时上传 `arm64-v8a` 和 `armeabi-v7a`

## 🔧 优化和故障排除

### 构建速度优化

1. **仅构建目标架构**:
```powershell
# 仅构建 ARM64 版本
.\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a
```

2. **增加 Gradle 内存**:
编辑 `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx8192m -XX:MaxMetaspaceSize=2048m
org.gradle.daemon=true
org.gradle.parallel=true
```

### 常见问题解决

#### 1. 中文路径问题
**错误**: `[CXX1429] error when building with cmake`
**解决**: 确保设置环境变量，避免中文路径

#### 2. 签名配置错误  
**错误**: `Failed to read key from keystore`
**解决**: 检查 `keystore.properties` 路径和密码

#### 3. 内存不足
**错误**: `java.lang.OutOfMemoryError`
**解决**: 增加 Gradle JVM 内存配置

#### 4. NDK 配置问题
**错误**: `NDK is not configured`
**解决**: 在 Android Studio SDK Manager 中安装 NDK 26.1.10909125

## 📝 版本管理

### 版本号配置
版本信息在 `package.json` 中管理：
```json
{
  "version": "1.8.0",
  "versionCode": 180
}
```

### 更新版本流程
1. 修改 `package.json` 中的版本号
2. 确保 `versionCode` 递增（数字版本，用于应用商店）
3. 重新构建 Release 版本

## 🔐 安全注意事项

### 密钥管理
- ✅ 使用强密码保护密钥库
- ✅ 定期备份密钥库文件到安全位置
- ✅ 不要在代码仓库中存储密钥文件
- ✅ 团队协作时安全分享密钥信息

### 构建环境
- ✅ 在受信任的环境中进行正式构建
- ✅ 验证构建产物的完整性
- ✅ 定期更新构建工具和依赖

## 📚 相关资源

- [React Native 官方签名文档](https://reactnative.dev/docs/signed-apk-android)
- [Android 应用签名指南](https://developer.android.com/studio/publish/app-signing)
- [Gradle 构建优化](https://docs.gradle.org/current/userguide/performance.html)

## 📄 构建记录

**最后成功构建**: 2025-12-17 19:50
**构建版本**: v1.8.0
**构建时间**: 4分43秒
**生成文件数**: 5个 APK 文件
**构建环境**: Windows PowerShell + Gradle 8.8

---

**维护者**: lx-music-mobile 开发团队  
**文档版本**: 1.0  
**最后更新**: 2025-12-17
