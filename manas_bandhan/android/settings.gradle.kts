pluginManagement {
    val flutterSdkPath =
        run {
            val properties = java.util.Properties()
            file("local.properties").inputStream().use { properties.load(it) }
            val flutterSdkPath = properties.getProperty("flutter.sdk")
            require(flutterSdkPath != null) { "flutter.sdk not set in local.properties" }
            flutterSdkPath
        }

    includeBuild("$flutterSdkPath/packages/flutter_tools/gradle")

    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id("dev.flutter.flutter-plugin-loader") version "1.0.0"
    id("com.android.application") version "8.11.1" apply false
    id("org.jetbrains.kotlin.android") version "2.2.20" apply false
    id("com.google.gms.google-services") version "4.4.2" apply false
}

include(":app")

// Fix for isar_flutter_libs missing namespace (required for AGP 8+)
val isarFlutterLibsBuildGradle = file("${System.getProperty("user.home")}/.pub-cache/hosted/pub.dev/isar_flutter_libs-3.1.0+1/android/build.gradle")
if (isarFlutterLibsBuildGradle.exists()) {
    val content = isarFlutterLibsBuildGradle.readText()
    if (!content.contains("namespace")) {
        val patchedContent = content.replace(
            "android {",
            "android {\n    namespace 'dev.isar.isar_flutter_libs'"
        )
        isarFlutterLibsBuildGradle.writeText(patchedContent)
    }
}
