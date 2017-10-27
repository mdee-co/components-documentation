
const componentsVersion = process.argv[process.argv.indexOf('--components-version') + 1]

const moment = require('moment')

const gulp = require('gulp')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const es = require('event-stream')

const BASE_DIR = '../sites-generator/components/'

const getTag = tag => `  - ${tag}\n`

const getHeader = (name, tags) => `---
layout: post
title: ${name}
author: David Ballesteros
tags:
${tags.slice(1, -1).map(tag => getTag(tag)).join('')}
categories:
${tags.map(tag => getTag(tag)).join('')}
script: ${name.replace('components.', '')}
componentsversion: ${componentsVersion}
---
`

const setHeader = () =>
  es.map((file, cb) => {
    let fileContent = file.contents.toString()

    let name = file.path
      .substring(file.path.indexOf('sites-generator'))
      .replace('/README.md', '')
      .replace('sites-generator/', '')
    let tags = name.split('/')
    file.contents = new Buffer(getHeader(name.replace(/\//g, '.'), tags) + fileContent)
    cb(null, file)
  })

gulp.task('clean', () =>
  gulp.src('./_posts/**/*')
    .pipe(clean())
)

gulp.task('copy', ['clean'], () =>
  gulp.src(`${BASE_DIR}**/README.md`)
    .pipe(setHeader())
    .pipe(rename(path => {
      let date = moment().format('YYYY-MM-DD')
      path.basename = (date + '-' + path.dirname).replace(/\//g, '-')
      path.dirname = ''

    }))
    .pipe(gulp.dest('./_posts'))
)

gulp.task('default', ['copy'])
