# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.3.2
audit: autofix brace-expansion, js-yaml

## 0.3.1
fix: ApiResponseFile + ApiResponseOneOf were intended to use `@ApiOkResponse` instead of `@ApiResponse`

## 0.3.0
post processing: introduce operation visitors

decorator ApiPropertyFile: new
decorator ApiResponseFile: new

decorator ApiPropertyArrayOf: no oneOf wrapping if only one type is given
decorator ApiPropertyEnum: option isArray

## 0.2.0
Introduce post processing

## 0.1.0
First version