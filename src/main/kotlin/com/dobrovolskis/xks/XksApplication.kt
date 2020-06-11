package com.dobrovolskis.xks

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories
class XksApplication

@Suppress("SpreadOperator") // used only on startup
fun main(args: Array<String>) {
    runApplication<XksApplication>(*args)
}
