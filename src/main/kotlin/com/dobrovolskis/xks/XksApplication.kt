package com.dobrovolskis.xks

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class XksApplication

fun main(args: Array<String>) {
	runApplication<XksApplication>(*args)
}
