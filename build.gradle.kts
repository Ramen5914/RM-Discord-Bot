plugins {
    id("java")
}

group = "com.r4men"
version = "0.0.1"

repositories {
    mavenCentral()
}

val discord4jVersion: String by project

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // Discord4J
    implementation("com.discord4j:discord4j-core:${discord4jVersion}")
}

tasks.test {
    useJUnitPlatform()
}