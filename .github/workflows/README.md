# 🔄 CI/CD Pipeline

Este proyecto utiliza GitHub Actions para automatización continua.

## 🚀 Workflows Configurados

### 1. **CI Pipeline** (`ci.yml`)
Se ejecuta en cada push y pull request a `master`/`main`.

**Jobs:**
- 🔍 **Lint** - Verifica estilo de código
- 🔨 **Build** - Valida que el código compila sin errores
- 🧪 **Test** - Ejecuta tests (preparado para el futuro)
- 🐳 **Docker** - Valida que el Dockerfile funciona
- 🔒 **Security** - Auditoría de vulnerabilidades en dependencias

**Beneficios:**
- ✅ Detecta errores antes de deployar
- ✅ Mantiene calidad de código
- ✅ Render solo deploya si todos los checks pasan

### 2. **Deploy Notification** (`deploy.yml`)
Notifica cuando se dispara un deploy a Render.

### 3. **Dependabot** (`dependabot.yml`)
Mantiene dependencias actualizadas automáticamente:
- 📦 Dependencias de npm (semanal)
- ⚙️ GitHub Actions (semanal)

## 📊 Cómo ver los resultados

1. Ve a tu repo: https://github.com/DriifterSelf/discord-music-bot
2. Click en la pestaña **"Actions"**
3. Verás todos los workflows ejecutándose

## ✅ Badge de Status

El badge de CI/CD en el README muestra:
- ✅ Verde = Todos los checks pasaron
- ❌ Rojo = Algún check falló
- 🟡 Amarillo = En progreso

## 🔧 Personalización

Para modificar los checks, edita los archivos en `.github/workflows/`
