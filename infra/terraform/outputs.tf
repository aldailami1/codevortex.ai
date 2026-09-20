output "vpc_id" {
  value = module.foundation.vpc_id
}

output "isolated_subnet_ids" {
  value = module.foundation.isolated_subnet_ids
}

output "standard_queue_arn" {
  value = module.foundation.standard_queue_arn
}

output "fifo_queue_arn" {
  value = module.foundation.fifo_queue_arn
}

output "worker_task_role_arn" {
  value = module.foundation.worker_task_role_arn
}
