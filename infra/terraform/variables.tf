variable "aws_region" {
  description = "AWS region for the CloudForge environment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "name_prefix" {
  description = "Short resource name prefix"
  type        = string
  default     = "cloudforge"
}

variable "vpc_cidr" {
  description = "CIDR for the CloudForge VPC"
  type        = string
  default     = "10.40.0.0/16"
}

variable "availability_zones" {
  description = "At least two availability zones for isolated subnets"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]

  validation {
    condition     = length(var.availability_zones) >= 2
    error_message = "CloudForge requires at least two availability zones."
  }
}
