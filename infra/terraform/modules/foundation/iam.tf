data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "control_plane_task" {
  name               = "${var.name_prefix}-${var.environment}-control-plane-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

resource "aws_iam_role" "worker_task" {
  name               = "${var.name_prefix}-${var.environment}-worker-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

data "aws_iam_policy_document" "worker_sqs" {
  statement {
    sid       = "ReceiveDeploymentMessages"
    effect    = "Allow"
    actions   = ["sqs:ChangeMessageVisibility", "sqs:DeleteMessage", "sqs:GetQueueAttributes", "sqs:ReceiveMessage"]
    resources = [aws_sqs_queue.standard.arn, aws_sqs_queue.fifo.arn]
  }

  statement {
    sid       = "PublishDeploymentMessages"
    effect    = "Allow"
    actions   = ["sqs:GetQueueAttributes", "sqs:SendMessage"]
    resources = [aws_sqs_queue.standard.arn, aws_sqs_queue.fifo.arn]
  }
}

resource "aws_iam_policy" "worker_sqs" {
  name   = "${var.name_prefix}-${var.environment}-worker-sqs"
  policy = data.aws_iam_policy_document.worker_sqs.json
}

resource "aws_iam_role_policy_attachment" "worker_sqs" {
  role       = aws_iam_role.worker_task.name
  policy_arn = aws_iam_policy.worker_sqs.arn
}
