variable "aws_region" {
  type    = string
  default = "af-south-1"
}

variable "bucket_name" {
  type = string
  description = "Globally unique name for the S3 bucket"
  default = "to-do-app-bucket-someflairyk"
}