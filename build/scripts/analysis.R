trim <- function (x) gsub("^\\s+|\\s+$", "", x)

# command arguments
args = commandArgs(trailingOnly=TRUE)
analysis_path<-trim(args[1])	# path to app's analysis files
temp_path<-trim(args[2])	# path to user's temp directory
input_file<-trim(args[3])	# file where user inputs will be loaded from
output_file<-trim(args[4])	# file where analysis output will be saved


# install libraries if needed (TO BE HANDLED VIA DOCKER)
r<-"http://cran.us.r-project.org"
if (!require("ModelMetrics")) { install.packages("ModelMetrics", repos=r) }
if (!require("nnet")) { install.packages("nnet", repos=r) }
if (!require("dplyr")) { install.packages("dplyr", repos=r) }
if (!require("caret")) { install.packages("caret", repos=r) }
if (!require("e1071")) { install.packages("e1071", repos=r) }

# load up required libraries
library("ModelMetrics")
library("nnet")
library("dplyr")
library("caret")
library("e1071")


# global options
set.seed(1234)
digits=4
options(scipen = 999)


# settings and configuration files
data<-read.csv(file.path(analysis_path, "data.csv"))
inputs<-read.csv(input_file, sep=',', header=T)
output_image1<-file.path(temp_path, "output1.png")


# run analysis


# populate output file
write("{", file=output_file, append=FALSE, sep="")
write(paste("\"prediction\": \"Predicted Value HERE\""), file=output_file, append=TRUE, sep="")
write("} ", file=output_file, append=TRUE, sep="")

# generate image file
png(file=output_image1, bg = "transparent")
plot(1:10)
rect(1, 5, 3, 7, col = "white")
dev.off()

