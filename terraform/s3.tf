# stores images named by sequence, ready for public access
resource "aws_s3_bucket" "portfolio" {
  bucket = "juntan-portfolio-images"
}

resource "aws_s3_bucket_acl" "portfolio_acl" {
    bucket = aws_s3_bucket.portfolio.id
    acl = "public-read"
}

resource "aws_s3_bucket_policy" "portfolio-policy" {
    bucket = aws_s3_bucket.portfolio.id
    policy = data.aws_iam_policy_document.public_object_read.json
}

data "aws_iam_policy_document" "public_object_read" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.portfolio.arn,
      "${aws_s3_bucket.portfolio.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_cors_configuration" "portfolio_cors" {
  bucket = aws_s3_bucket.portfolio.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["http://localhost:8000", "https://juntan.me"]
  }
}