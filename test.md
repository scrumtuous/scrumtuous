---
layout: gcp-architect-exam-question
title: "AWS Data Collection For Global Sites Question"
meta: "AWS Exam Question: A company collects data for temperature, humidity, and atmospheric pressure across continents with 500 GB daily. What’s the answer? AWS S3, high-speed Internet."
slug: "q-42-temperature-humidity-pressure-s3"
certification: "AWS Solution Architect Associate Exam"
---

1
{: .ordinal}


 A company gathers data on temperature, humidity, and atmospheric pressure from various cities spanning multiple continents. Each site generates an average of 500 GB of data daily and is equipped with a high-speed Internet connection. The company aims to consolidate this data from all global locations into a single Amazon S3 bucket as swiftly as possible, while keeping operational complexity to a minimum. What solution would effectively fulfill these criteria?
{: .query}

- [x] A. Enable S3 Transfer Acceleration for the target S3 bucket. Utilize multipart uploads to directly transfer site data to the designated S3 bucket.
{: .option}
- [ ] B. Transfer the data from every site to an S3 bucket located in the nearest Region. Utilize S3 Cross-Region Replication to duplicate the objects to the target S3 bucket. After that, delete the data from the source S3 bucket.
{: .option}
- [ ] C. Plan daily jobs for the AWS Snowball Edge Storage Optimized device to move data from every site to the nearest Region. Utilize S3 Cross-Region Replication to duplicate objects into the target S3 bucket.
{: .option}
- [ ] D. Transfer the data from each site to an Amazon EC2 instance located in the nearest Region. Save the data on an Amazon Elastic Block Store (Amazon EBS) volume. Periodically, create an EBS snapshot and transfer it to the Region where the target S3 bucket is located. Then, restore the EBS volume in that Region.
{: .option}

A
{: .answer}

The correct answer to the question is **A. Enable S3 Transfer Acceleration for the target S3 bucket. Utilize multipart uploads to directly transfer site data to the designated S3 bucket.**

### Explanation of the Correct Answer (A)

1. **S3 Transfer Acceleration**: This feature allows you to upload files to S3 from anywhere in the world with higher speeds. It leverages Amazon CloudFront's globally distributed edge locations to accelerate uploads. When a user uploads a file, the data is routed to the nearest edge location, which then transfers the data to the S3 bucket over optimized network paths. This is particularly beneficial when dealing with large data volumes (like 500 GB daily) across multiple global sites.

2. **Multipart Uploads**: This allows you to upload large objects in parts, making it easier to manage and recover from errors during the upload process. If a part fails to upload, you can retry just that part rather than the entire file. This is particularly useful for large volumes of data, ensuring that the upload process is efficient and resilient.

3. **Minimizing Operational Complexity**: This solution is straightforward to implement and does not involve additional infrastructure or complexity like managing EC2 instances or Snowball devices. It directly connects the sites to S3, reducing the number of moving parts.

### Why the Other Options Are Incorrect

**B. Transfer the data from every site to an S3 bucket located in the nearest Region. Utilize S3 Cross-Region Replication to duplicate the objects to the target S3 bucket. After that, delete the data from the source S3 bucket.**
- **Latency and Complexity**: This option adds unnecessary latency and operational complexity. Transferring data to a temporary S3 bucket in a different region and then replicating it to the target S3 bucket can result in slower transfers and increased data transfer costs. Additionally, managing two buckets and ensuring data integrity adds complexity.

**C. Plan daily jobs for the AWS Snowball Edge Storage Optimized device to move data from every site to the nearest Region. Utilize S3 Cross-Region Replication to duplicate objects into the target S3 bucket.**
- **Not Ideal for Real-Time Needs**: AWS Snowball is designed for transferring large amounts of data physically, which is impractical for daily data ingestion from multiple sites. This option is better suited for one-time or infrequent large data migrations rather than continuous data collection. It introduces delays and operational overhead.

**D. Transfer the data from each site to an Amazon EC2 instance located in the nearest Region. Save the data on an Amazon Elastic Block Store (Amazon EBS) volume. Periodically, create an EBS snapshot and transfer it to the Region where the target S3 bucket is located. Then, restore the EBS volume in that Region.**
- **High Operational Complexity**: This solution involves multiple steps, including managing EC2 instances and EBS volumes, which adds significant operational overhead and complexity. It also introduces latency due to the need to transfer data to and from EBS and requires management of EC2 instances, which is not necessary for a straightforward S3 upload strategy.

### Technical Details for AWS Solution Architect Associate Exam

1. **S3 Transfer Acceleration**: Understand how it works and when to use it. It’s particularly useful for large files and global uploads.
   
2. **Multipart Uploads**: Know how to implement multipart uploads, their benefits, and how they improve fault tolerance and performance.

3. **AWS Data Transfer Options**: Be familiar with various data transfer options, including:
   - Direct transfers to S3
   - Using AWS Snowball
   - EC2 and EBS for data transfer
   - Cross-Region Replication and its use cases

4. **S3 Bucket Policies and Permissions**: Understand how to manage access to S3 buckets, including IAM roles, bucket policies, and security best practices.

5. **Cost Implications**: Be aware of the costs associated with data transfer, storage, and operations across different AWS services.

By focusing on these areas, you can deepen your understanding of AWS services relevant to data aggregation and transfer, which is crucial for passing the AWS Solution Architect Associate exam.
{: .chat-gpt-explanation}

AWS Solution Architect Associate Exam
{: .certificationKey}

### Original Query

A company collects data for temperature, humidity, and atmospheric pressure in cities across multiple continents. The average volume of data that the company collects from each site daily is 500 GB. Each site has a high-speed Internet connection.
The company wants to aggregate the data from all these global sites as quickly as possible in a single Amazon S3 bucket. The solution must minimize operational complexity.
Which solution meets these requirements?
{: .original-query}

### Original Questions

- [ ] A. Turn on S3 Transfer Acceleration on the destination S3 bucket. Use multipart uploads to directly upload site data to the destination S3 bucket.
{: .originaloption}
- [ ] B. Upload the data from each site to an S3 bucket in the closest Region. Use S3 Cross-Region Replication to copy objects to the destination S3 bucket. Then remove the data from the origin S3 bucket.
{: .originaloption}
- [ ] C. Schedule AWS Snowball Edge Storage Optimized device jobs daily to transfer data from each site to the closest Region. Use S3 Cross-Region Replication to copy objects to the destination S3 bucket.
{: .originaloption}
- [ ] D. Upload the data from each site to an Amazon EC2 instance in the closest Region. Store the data in an Amazon Elastic Block Store (Amazon EBS) volume. At regular intervals, take an EBS snapshot and copy it to the Region that contains the destination S3 bucket. Restore the EBS volume in that Region.
{: .originaloption}


### Comments

--- 
The objective is to aggregate data from global sites into a single Amazon S3 bucket as efficiently as possible while minimizing operational complexity.

Option A is the optimal solution. By enabling S3 Transfer Acceleration, the company can leverage Amazon’s edge locations to facilitate high-speed data transfers, allowing for immediate uploads. Additionally, using multipart uploads enables the parallel transfer of large files, significantly improving upload times.

In contrast, options B, C, and D do not effectively minimize operational complexity or maximize speed when compared to option A. These alternatives involve additional steps, such as transferring data to intermediary storage locations or relying on cross-region replication, which could introduce delays and increase operational overhead. Therefore, option A stands out as the most efficient and straightforward approach.
{: .comment}
--- 
Alright, let’s break it down and have a little fun while we’re at it! 🌍💻

So, you've got a treasure trove of data flowing in from all corners of the globe—think of it as the world's biggest digital potluck! With a blazing-fast internet connection at each site, your mission is to gather all that delicious data into a single Amazon S3 bucket quicker than you can say "byte-sized snacks"! 🍕📦

To make your life easier and keep things running smoothly, the best option here is to enable S3 Transfer Acceleration. Here’s why it's the superhero of your data aggregation endeavor:

- It’s like having a speedy delivery service for your data! 🚀 S3 Transfer Acceleration works wonders for long-distance data transfers by utilizing those nifty Edge Locations, ensuring your files zip through the internet faster than a cheetah on roller skates.
- This solution can crank up transfer speeds by an impressive 50-500%! Talk about a turbo boost! 💨
- It's perfect for all sorts of scenarios—think mobile and web app uploads, sharing files between offices, or even sending data to your best business buddies. Plus, if you’re dealing with massive datasets, you can grant special access to your S3 buckets for super-fast uploads, keeping the innovation train rolling! 🚂💡

Now, let’s take a quick look at the other options:

- Option B is more of a safety net for disaster recovery—great for when you need to play it safe!
- Option C is like a bridge connecting your local setup to the AWS Cloud—handy for data transfers but not the quickest route for this scenario!
- Option D is another disaster recovery approach, focusing on snapshots and storage, but it doesn’t have that immediate speed you’re after.

So, grab your cape (and maybe a snack) and set up S3 Transfer Acceleration—it’s the fastest way to gather all that data and keep operational complexity to a minimum! 🦸‍♂️✨
{: .comment}
--- 
Option C seems to be the best fit here, given that we have local environments (or "sites") gathering data that needs to be sent to the AWS cloud. But let’s take a moment to consider why it might not be the golden ticket. The question doesn’t mention anything about handling large objects, which is a prerequisite for using multipart uploads. So, while C is a solid choice, it’s not without its quirks. After all, who needs multipart uploads when the data might just be doing its thing without the need for all that complexity?
{: .comment}
--- 
Hello everyone,

I just completed the exam today, and I found it to be quite challenging! None of the questions were sourced from examtopics, and I encountered around 150 questions overall. The material we’ve reviewed here seems much simpler compared to what I experienced during the exam. I highly recommend checking out some YouTube videos, particularly from the channel "sthithapragna," in addition to using examtopics. I found the YouTube content to be very relevant and accurate for the exams I took today (1/13/2025). I hope this feedback is helpful to all of you!
{: .comment}
--- 
Explanation:  
Option B proposes a delightful approach to transferring data! It involves sending the data from each site to an S3 bucket located in the nearest Region, which is a fantastic way to leverage those speedy Internet connections. Once the data is uploaded, S3 Cross-Region Replication takes the reins, effortlessly duplicating the objects to the target S3 bucket. This seamless process not only ensures swift data transfer but also simplifies aggregation, making it a cheerful solution for managing global data! 🌍✨
{: .comment}
