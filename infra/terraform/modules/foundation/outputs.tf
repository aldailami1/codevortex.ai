output "vpc_id" {
  value = aws_vpc.this.id
}

output "isolated_subnet_ids" {
  value = [for subnet in aws_subnet.isolated : subnet.id]
}

output "standard_queue_arn" {
  value = aws_sqs_queue.standard.arn
}

output "fifo_queue_arn" {
  value = aws_sqs_queue.fifo.arn
}

output "worker_task_role_arn" {
  value = aws_iam_role.worker_task.arn
}
