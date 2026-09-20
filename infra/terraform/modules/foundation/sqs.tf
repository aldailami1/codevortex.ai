locals {
  standard_queue_name = "${var.name_prefix}-${var.environment}-deployment"
  fifo_queue_name     = "${var.name_prefix}-${var.environment}-ordered.fifo"
}

resource "aws_sqs_queue" "standard_dlq" {
  name                      = "${local.standard_queue_name}-dlq"
  message_retention_seconds = 1209600
  sqs_managed_sse_enabled   = true
}

resource "aws_sqs_queue" "standard" {
  name                       = local.standard_queue_name
  visibility_timeout_seconds = 900
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.standard_dlq.arn
    maxReceiveCount     = 5
  })
}

resource "aws_sqs_queue" "fifo_dlq" {
  name                        = "${local.fifo_queue_name}-dlq"
  fifo_queue                  = true
  content_based_deduplication = true
  message_retention_seconds   = 1209600
  sqs_managed_sse_enabled     = true
}

resource "aws_sqs_queue" "fifo" {
  name                        = local.fifo_queue_name
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = 900
  message_retention_seconds   = 345600
  receive_wait_time_seconds   = 20
  sqs_managed_sse_enabled     = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.fifo_dlq.arn
    maxReceiveCount     = 5
  })
}
