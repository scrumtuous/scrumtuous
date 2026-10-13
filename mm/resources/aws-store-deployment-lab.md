# Deploy Your Store: S3, Route 53, PostgreSQL, Kafka and Beanstalk

## Starting point: infrastructure is already provisioned

**The Lightsail Linux instance and Lightsail managed PostgreSQL database have already been provisioned in AWS. Docker is installed and Kafka is ready to use.** You will create your own logical database, Kafka topics, DNS records and application deployment. Do not create another shared server, replace the broker, or delete another student's resources.

Examples use `roflgator`. Replace that token with your lowercase name. 

Fields marked `xxxx` must be corrected before running the application.

The shared resources for this class are:

| Resource | Provided value |
| --- | --- |
| AWS Region | `us-east-1` |
| Route 53 public hosted zone | `livefree.click` |
| Linux static IPv4 address | `32.199.0.184` |
| PostgreSQL endpoint | `ls-de1b46cf51b8647cb2b1b43ccbacbb06433f584c.citm64k00r0w.us-east-1.rds.amazonaws.com` |
| PostgreSQL port | `5432` |
| Database username | `dbmasteruser` |
| Database password | Supplied separately |

Use the current connection details shown in your AWS console if a resource has been replaced. Never put the database password in S3 or JavaScript.

### Already Done For You

Docker is installed on the Linux VM, and the Kafka container is ready to use. **The Docker setup commands below were run during environment preparation. Do not run them again.** 

```bash
sudo apt-get update
sudo apt-get install -y curl
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable --now docker
sudo docker run --rm hello-world
```

The existing Kafka container is named `kafka`. Its client port is 9092, its internal command-line listener is 19092, and its controller listener is 9093.

The PostgreSQL server is a **managed Lightsail database**, so AWS installed PostgreSQL when the database resource was provisioned. Your task will be to create a named database inside that existing server using the Postgres Admin tool (pgAdmin).

## Your deployment map

Complete the right-hand column before starting. Use a unique short lowercase name with letters and digits. Keep the hyphens and dots in the examples in their designated positions.

| Item | Example | Your value |
| --- | --- | --- |
| Student token | `roflgator` | __________ |
| S3 bucket and website hostname | `www-roflgator.livefree.click` | __________ |
| Logical PostgreSQL database | `roflgator-store` | __________ |
| Database DNS hostname | `roflgator-postgres.livefree.click` | __________ |
| Kafka DNS hostname | `roflgator-linux.livefree.click` | __________ |
| Validation topic | `roflgator-purchases.validate` | __________ |
| Processing topic | `roflgator-purchases.process` | __________ |
| Validator consumer group | `roflgator-validators` | __________ |
| Processor consumer group | `roflgator-processors` | __________ |
| Backend DNS hostname | `app-roflgator.livefree.click` | __________ |

The frontend will live in S3. Its JavaScript calls the Beanstalk API. The API reads/writes PostgreSQL and sends/consumes Kafka messages. Browsers do not connect directly to PostgreSQL or Kafka.

**Naming challenge:** Which strings are yours to rename, and which are framework property keys that must remain unchanged?

## 1. Publish the static frontend to S3

### 1.1 Inspect the project

Locate `src/main/resources/static` in the full Spring Boot project. Upload the **contents** of this directory to S3, preserving relative paths; do not place everything underneath a new `static/` directory.

The supplied pages reference `styles.css`, `common.js` and several navigation targets. The attachments are only a subset of the website. Collect all HTML, CSS, JavaScript, images and other assets from the full project. If using the timestamped attached home page, give the deployed file the normal name `index.html`.

Keep a local copy in the project initially so you can test the pages from Spring Boot later. Copying them to S3 is sufficient to migrate their hosting; deleting your local source files is unnecessary.

### 1.2 Create and configure the bucket

1. Create a general-purpose S3 bucket named `www-roflgator.livefree.click`, replacing `roflgator` first.
2. Use the lab Region, `us-east-1`.
3. Keep ACLs disabled; use a bucket policy for public reads.
4. Enable **Static website hosting** and set the index document to `index.html`.
5. Upload all static assets to the bucket root.
6. Adjust the bucket's Block Public Access settings to permit the intended public-read bucket policy. Account or organization restrictions can still prevent this; a bucket setting cannot override a higher-level restriction. Verify that your lab account permits public website hosting before continuing.
7. Add this policy after replacing the example bucket name:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadWebsiteObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::www-roflgator.livefree.click/*"
    }
  ]
}
```

This grants public object reads, not uploads or bucket administration. Upload only public website assets: no JAR, properties file, credentials or Java source.

Open the **website endpoint** copied from the bucket's Properties tab. Use `http://` for this stage. Direct S3 website endpoints do not support HTTPS. [3][4]

**Checkpoint:** The home page, stylesheet and navigation load. API requests may fail now because the backend is not connected yet.

## 2. Give the S3 website its own Route 53 name

In the existing public hosted zone `livefree.click`, create:

| Setting | Student task |
| --- | --- |
| Record name | `www-roflgator` with your token |
| Type | `A` |
| Alias | Enabled |
| Target | S3 website endpoint in your bucket's Region |
| Routing policy | Simple |
| Evaluate target health | No |

The complete hostname must **exactly match the bucket name**. `www-roflgator.livefree.click` and `www.roflgator.livefree.click` are different names. An ordinary A record takes an IP address; an AWS alias A record can target an eligible AWS service. [3]

If the bucket is missing from the alias selector, check the account, Region, website hosting and exact name first. Do not select an unrelated bucket.

### CNAME fallback for this subdomain

If you cannot select the correct alias target, use a **CNAME** at the same subdomain pointing to the bucket's exact website endpoint hostname copied from AWS. Remove `http://` and any trailing path. Do not use the S3 REST endpoint or an `s3://` address.

Remove the conflicting A record before creating the CNAME: a CNAME cannot coexist with other record types at the same name. This fallback works for this subdomain, not the hosted-zone apex `livefree.click`. It does not fix a wrong bucket name, permissions or disabled website hosting. [3][4]

Verify in Windows PowerShell:

```powershell
Resolve-DnsName www-roflgator.livefree.click
```

Open `http://www-roflgator.livefree.click` using your replacement name.

**Explain:** Why does a successful DNS lookup not guarantee that S3 will return `index.html`?

## 3. Create your database inside the existing PostgreSQL server

### 3.1 Connect to the shared server

Use the **Postgres Admin tool (pgAdmin)** to connect to the existing server:

1. Open pgAdmin and choose **Register -> Server**.
2. On **General**, give the connection a recognizable name, such as `My AWS Store`.
3. On **Connection**, enter the AWS PostgreSQL endpoint from the starting table, port `5432`, maintenance database `postgres`, and username `dbmasteruser`.
4. Enter the supplied database password. In the SSL settings, select SSL mode **Require**. The tab or field location varies by pgAdmin version.
5. Save the connection and expand the server in the Browser tree.

The Lightsail resource name, such as `thornton-db`, is not necessarily a SQL database name. Every Lightsail PostgreSQL server has a `postgres` database you can connect to initially. [5]

**Create your database with the pgAdmin interface:** right-click **Databases**, select **Create -> Database**, enter `roflgator-store` with your own token, and save. Keep the appropriate database owner, normally the connected lab user. In this name field, do not type SQL double quotes.

Alternatively, open pgAdmin's **Query Tool** against the maintenance database and use the SQL statement below. Choose either the interface or SQL method; you do not need to create the database twice.

Create your logical database. Replace the token before executing:

```sql
CREATE DATABASE "roflgator-store";
```

The double quotes matter because the name contains a hyphen. Run this as a standalone statement with autocommit enabled, not inside a transaction block. If it already exists, inspect it rather than dropping it.

### 3.2 Create a database CNAME

Create `roflgator-postgres` in the hosted zone, replacing the token. Use type **CNAME**, targeting the full AWS PostgreSQL endpoint hostname above.

Do not include `jdbc:postgresql://`, a port, database name or query parameters in DNS. Do not copy the database's current resolved IP into an A record; its address can change.

Test your CNAME and connect through it to your new database:

```powershell
Resolve-DnsName roflgator-postgres.livefree.click
Test-NetConnection roflgator-postgres.livefree.click -Port 5432
```

Complete this connection template in the AWS profile later:

```properties
spring.datasource.url=jdbc:postgresql://roflgator-postgres.livefree.click:xxxx/xxxx?sslmode=require
```

**Checkpoint:** Through your CNAME, run `SELECT current_database();` and confirm your student database name. A successful port test alone does not prove password or database access.

The supplied lab uses public mode on the managed database. Confirm it is enabled if testing from outside Lightsail. Do not attempt to fix managed-database access by opening port 5432 on the separate Kafka VM.

`sslmode=require` encrypts the JDBC connection but does not verify the certificate identity/hostname. A production setup should use verified TLS; a custom CNAME may not match the managed database certificate. [6]

## 4. Name and verify the shared Kafka broker

### 4.1 Create your Kafka CNAME

To practice both A and CNAME records without relying on another pre-existing Linux hostname, create these two records in `livefree.click`. Replace `roflgator` in both names:

| Record name | Type | Target |
| --- | --- | --- |
| `roflgator-broker` | Ordinary A, alias disabled | `32.199.0.184` |
| `roflgator-linux` | CNAME | `roflgator-broker.livefree.click` |

Your application uses `roflgator-linux.livefree.click`. DNS follows that CNAME to your A record and then to the VM's static IP. A CNAME takes a hostname, never an IP address. Do not create both an A record and CNAME at `roflgator-linux`.

```powershell
Resolve-DnsName roflgator-linux.livefree.click
Test-NetConnection roflgator-linux.livefree.click -Port 9092
```

Kafka has two relevant addresses: the bootstrap address your application uses first, and the broker address returned in Kafka metadata. Your CNAME controls the initial lookup; it does not rewrite Kafka metadata. Inspect the existing advertised address:

```bash
sudo docker inspect kafka --format '{{range .Config.Env}}{{println .}}{{end}}' | grep KAFKA_ADVERTISED_LISTENERS
```

The advertised external address must also be reachable from your application. It can differ from your student alias. Do not recreate the shared broker to give it a different hostname for every student. If its advertised address is unreachable, record that finding as the connection problem before proceeding.

### 4.2 SSH into the existing Linux instance

Use **Lightsail -> Instances -> the assigned Linux instance -> Connect using SSH**. Check:

```bash
sudo docker ps --filter name=kafka
sudo docker logs --tail 30 kafka
```

If Kafka is absent or stopped, inspect the container status and logs before continuing. Do not launch a second broker on port 9092 or replace the shared container.

Verify that the Lightsail firewall allows TCP 9092 from the public outbound addresses used by local development machines and Beanstalk. For Beanstalk this could be EC2 public IPs or a NAT gateway Elastic IP; it is not necessarily the IP returned by the application's public URL. Ports 19092 and 9093 remain internal. This broker uses unauthenticated plaintext, so limit the allowed sources.

## 5. Create your two Kafka topics and update the source code

Kafka calls these **topics**, even though the application uses queue-like processing. Create your own pair; do not use another student's topics.

Replace `roflgator` in each command, then run it in the Lightsail SSH terminal. Each command is one line. The small heap override avoids starting another 512 MB Java process on the shared VM.

```bash
sudo docker exec -e KAFKA_HEAP_OPTS="-Xms32m -Xmx128m" kafka /opt/kafka/bin/kafka-topics.sh --create --if-not-exists --topic roflgator-purchases.validate --bootstrap-server localhost:19092 --partitions 3 --replication-factor 1
```

```bash
sudo docker exec -e KAFKA_HEAP_OPTS="-Xms32m -Xmx128m" kafka /opt/kafka/bin/kafka-topics.sh --create --if-not-exists --topic roflgator-purchases.process --bootstrap-server localhost:19092 --partitions 3 --replication-factor 1
```

Verify:

```bash
sudo docker exec -e KAFKA_HEAP_OPTS="-Xms32m -Xmx128m" kafka /opt/kafka/bin/kafka-topics.sh --describe --topic roflgator-purchases.validate --bootstrap-server localhost:19092
```

```bash
sudo docker exec -e KAFKA_HEAP_OPTS="-Xms32m -Xmx128m" kafka /opt/kafka/bin/kafka-topics.sh --describe --topic roflgator-purchases.process --bootstrap-server localhost:19092
```

`--if-not-exists` does not correct an existing topic's partition count. Confirm three partitions and replication factor one in the output.

### Source-code investigation

Search the full project for `roflgator`, `kafka.send`, `@KafkaListener` and `FakeKafka.start`.

| File | What you must inspect and change |
| --- | --- |
| `StoreProducers.java` | The topic passed to `kafka.send` in `submit` |
| `StoreConsumers.java` | Both listener topic names and the forwarding `kafka.send` topic |
| `StoreConsumers.java` | Give `validators` and `processors` student-specific group IDs |
| `FakeKafka.java` | Topic names used by the embedded development broker |
| `application.properties` | Your AWS hostnames and database settings |

Use the exact topic names you created. Prefix consumer groups too, so each student's offsets and assignments are independent. Group IDs are not topics; you do not create them with `kafka-topics.sh`.

The supplied `FakeKafka.java` contains this deliberate configuration problem:

```java
broker.brokerListProperty("roflgator-spring.kafka.bootstrap-servers");
```

**Repair exercise:** This argument identifies a Spring configuration key, not a student-owned resource. Find the correct standard bootstrap property key in your properties file and use that exact key. Replacing `roflgator` with your own name here would still be wrong. [7]

### Prevent embedded Kafka from starting in AWS

A configuration change might be needed later to ensure embedded Kafka does not run when the `aws` profile is active. You can address this if the problem arises during testing; no change is required for this step now.

## 6. Complete the Spring properties

Use the supplied `application.properties` as your starting point. Keep shared serializers, deserializers, logging and Swagger settings above the `#---` profile separators. Use ordinary ASCII punctuation in comments if your editor saves properties as ISO-8859-1.

Retain the development defaults:

```properties
spring.profiles.default=dev
server.port=8080
```

Keep H2 under the `dev` section. Complete the following AWS section yourself:

```properties
#---
spring.config.activate.on-profile=aws

server.port=5000

spring.datasource.url=jdbc:postgresql://roflgator-postgres.livefree.click:xxxx/xxxx?sslmode=require
spring.datasource.username=xxxx
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=xxxx

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.h2.console.enabled=false

spring.kafka.bootstrap-servers=roflgator-linux.livefree.click:9092
spring.kafka.security.protocol=PLAINTEXT
```

Fill in the PostgreSQL port, your logical database name, username and JDBC driver class. Set the password through the runtime environment. Do not leave `xxxx` or the example token in your final configuration.

Check `pom.xml` for the PostgreSQL JDBC driver (`org.postgresql:postgresql`, runtime scope) and retain the H2 dependency for local development. Let the existing Spring Boot dependency management select compatible versions.

`ddl-auto=update` can create/update tables inside an existing database; it does not create your named PostgreSQL database. Use it for this lab, not as a substitute for controlled production schema migrations.

**Explain:** Why must both the producer and consumers use the same student database when Kafka messages carry only a purchase ID?

## 7. Test the AWS profile locally before deploying

In your IDE, activate only `aws`, or in PowerShell use:

```powershell
$env:SPRING_PROFILES_ACTIVE="aws"
$env:SPRING_DATASOURCE_PASSWORD="REPLACE-WITH-DATABASE-PASSWORD"
.\mvnw.cmd spring-boot:run
```

Supply the real password through your IDE or secure local environment handling; do not submit it in your lab evidence. On Linux/macOS use `./mvnw` with equivalent environment variables.

| Runtime | Local page URL | Infrastructure |
| --- | --- | --- |
| `dev` | `http://localhost:8080` | H2 and embedded Kafka |
| `aws`, run on your laptop | `http://localhost:5000` | Lightsail PostgreSQL and Kafka |
| `aws`, run in Beanstalk | Environment HTTP/HTTPS URL, without `:5000` | Lightsail PostgreSQL and Kafka |

Check the startup log for the active profile, database connection, port 5000 and successful Kafka listener assignments. No embedded broker should start.

Open `http://localhost:5000/swagger-ui.html` or the HTML pages still in the application's static directory. Confirm the API Base URL input uses port 5000; an older saved value may still say 8080.

Use Swagger's actual request schemas to create the required customer/product/purchase data. Do not assume your old H2 rows exist in the new PostgreSQL database. Investigate any startup data initializer to ensure it does not delete or duplicate AWS data on every restart.

Test a valid queued purchase and observe `VALIDATED`, followed by `COMPLETED`. The supplied processing listener deliberately waits **60 seconds**. Test a product with a non-positive price or quantity and expect `REJECTED` if the application's request validation allows creating that test case.

To observe topic messages:

```bash
sudo docker exec -it -e KAFKA_HEAP_OPTS="-Xms32m -Xmx128m" kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:19092 --topic roflgator-purchases.process --from-beginning
```

Replace the token; press Ctrl+C to stop. Retained messages are purchase IDs, not complete purchase objects. Reading does not delete them. Do not join the application's consumer group just to inspect messages.

**Timing investigation:** A 60-second record handler can exceed `max.poll.interval.ms` when several records are returned in one poll. For this slow demonstration, consider `spring.kafka.consumer.max-poll-records=1`; explain why before adding it. Three partitions do not automatically create three listener threads in one application.

Stop your local AWS-mode application before final Beanstalk testing. Otherwise it can consume records alongside the deployed instance and make the deployment appear to work when the local process actually handled the purchase.

## 8. Prepare the API for an S3 frontend

The application's controllers already have CORS `*` enabled, allowing requests from any origin, including your S3 website. No additional CORS configuration is needed for this lab step.

## 9. Build and deploy the executable JAR to Beanstalk

1. Confirm the student names and AWS profile settings are complete. If embedded Kafka started unexpectedly during AWS-profile testing, resolve that before deploying.
2. Check the project Java version and choose a compatible **Java SE / Corretto** Beanstalk platform. This lab deploys an executable Spring Boot JAR, not a WAR to Tomcat.
3. Run your normal build from the project root:

```powershell
.\mvnw.cmd clean package
```

Do not skip failed tests just to get a JAR. Diagnose which profile and infrastructure the tests require. If a PostgreSQL password is required during the build, supply it through the environment, not source control.

4. Locate the executable application JAR under `target/`. Do not select `.jar.original`, a sources JAR or a test JAR.
5. Sanity-check it locally with the AWS environment variables set:

```powershell
java -jar target/YOUR-APPLICATION.jar --spring.profiles.active=aws
```

Stop that local process after the check.

6. Create or select your Beanstalk web environment. Select the existing lab service role and EC2 instance profile with the required Beanstalk permissions. Upload the executable JAR as the application version.
7. Set these Beanstalk environment properties before expecting the deployment to become healthy:

```text
SPRING_PROFILES_ACTIVE=aws
SPRING_DATASOURCE_PASSWORD=<database-password>
```

8. Confirm the app listens on port **5000**, matching the Java SE proxy's default upstream port. Public requests normally arrive on port 80 or configured HTTPS 443, not port 5000. [10]
9. Ensure the Beanstalk instances have outbound connectivity to PostgreSQL 5432 and Kafka 9092, and that the Kafka firewall accepts their outbound source addresses.
10. Check environment health and application logs. If a load balancer is used, choose an existing successful HTTP health-check path, such as `/` if the static index is retained, or a configured health endpoint.
11. Test the Beanstalk environment's own URL with Swagger and an actual queued purchase before adding DNS.

**Profile reminder:** Building while `aws` is active does not permanently select that profile inside the JAR. Beanstalk must activate `aws` at runtime. A packaged `spring.profiles.default=dev` is fine only when the deployment supplies the AWS override.

## 10. Add the Beanstalk Route 53 record

Create `app-roflgator`, replacing the token:

| Setting | Value to choose |
| --- | --- |
| Record type | `A` |
| Alias | Enabled |
| Target | Your regional Beanstalk environment |
| Region | The actual environment Region |
| Routing | Simple |

Use an **alias A record**, not an ordinary A record with an environment hostname pasted into the IP field. Do not pin the record to a temporary resolved load-balancer/instance IP.

If the environment is not an eligible alias target, inspect its regional endpoint and account. For this subdomain, a CNAME to the environment hostname is a valid fallback; do not keep both records at the same name. [11]

Test `http://app-roflgator.livefree.click/swagger-ui.html` after substituting your name. If HTTPS has been explicitly configured, test the HTTPS version with its valid certificate instead. Merely creating the record does not enable HTTPS.

## 11. Point the S3 JavaScript at your deployed API

Edit the **file** `common.js` in your local static assets, then re-upload it to S3.

In the supplied code, `defaultBaseUrl()` returns `window.location.origin` whenever an origin exists. When hosted on S3, that returns the frontend's origin, so requests go to S3 instead of Beanstalk. Changing only the `localhost:8080` fallback will not fix that branch.

**Your task:** Change the default selection so the deployed frontend uses your backend base URL, for example:

```text
http://app-roflgator.livefree.click
```

Replace the name and use the scheme actually configured on Beanstalk. Use the base URL only: no `/swagger-ui.html`, `/api` suffix or port 5000. Preserve the editable API Base URL input if you want to switch between local and deployed testing.

Read `initBaseUrlInput()` and `getBaseUrl()` before assuming your edit failed. They prefer a saved value under the localStorage key `storeDemoBaseUrl`. On your S3 website, clear that override using the browser console:

```javascript
localStorage.removeItem("storeDemoBaseUrl");
location.reload();
```

Alternatively, set the visible API Base URL input to your new backend URL. Re-upload the changed `common.js`, hard-refresh, and inspect the Network tab to confirm the browser fetched the new file. Verify the JavaScript response has an appropriate content type rather than an HTML error page.

**Final test:** From the S3 custom hostname, create and submit a purchase. Verify the request goes to the Beanstalk custom hostname, the row appears in your PostgreSQL database, and your Kafka consumers move it through the expected statuses with your laptop application stopped.

## Troubleshooting checkpoints

| Symptom | Investigate |
| --- | --- |
| S3 `NoSuchBucket` | Bucket name must match the requested website hostname |
| S3 403 | Public-read policy, Block Public Access and index object |
| Broken CSS or links | Missing assets, wrong filename case or extra upload directory |
| Website tries HTTPS and fails | Direct S3 website hosting is HTTP-only |
| PostgreSQL database does not exist | Create the student SQL database; resource names are different |
| PostgreSQL driver not found | Runtime driver dependency and driver-class setting |
| PostgreSQL authentication fails | Username/password, runtime environment and correct endpoint |
| Kafka bootstrap disconnected | DNS, 9092 firewall, broker logs, advertised hostname and memory |
| Java native memory allocation fails in CLI | Keep the small `docker exec -e KAFKA_HEAP_OPTS=...` override; inspect `free -h` |
| Topic exists but listeners see nothing | Exact producer/listener/topic strings, group offsets and active profile |
| Purchase ID cannot be found | Student database mismatch or retained messages referencing old data |
| Embedded Kafka starts in AWS | Remaining static startup call or incorrectly activated profiles |
| Beanstalk 502/unhealthy | Java version, executable JAR, port 5000, profile and startup logs |
| Browser CORS error | Backend origin/method/header rules and security preflight handling |
| API calls still go to S3/localhost | `defaultBaseUrl()` origin branch, localStorage or cached JavaScript |
| Purchases handled but no Beanstalk log | A local AWS-mode consumer may still be running |
| Processing repeatedly rebalances | Long handler plus too many records per poll |

## Submit your evidence

- Your completed naming table and DNS record types/targets, without credentials.
- S3 website custom URL and a screenshot showing CSS and navigation loaded.
- PostgreSQL query showing your logical database name.
- Topic descriptions showing the two names and three partitions each.
- Source diff showing consistent topic/group names, plus any embedded startup fix that was needed during testing.
- AWS startup log showing profile `aws` and port 5000, with credentials removed.
- A browser Network request from S3 to your Beanstalk custom hostname.
- One valid purchase completing and one rejected test, where supported.
- A short explanation of bootstrap versus advertised Kafka addresses, and why CORS is required.

## Cleanup

When your lab work no longer needs to remain available, delete only your own Beanstalk environment and student resources. Remove website DNS before deleting its matching S3 bucket to avoid leaving a dangling hostname. Do not delete the shared broker, Docker volume, Linux instance or managed database. Delete your student topics or logical database only after you have finished testing and confirmed that no other application uses them.

## Official references

1. [Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
2. [pgAdmin documentation](https://www.pgadmin.org/docs/)
3. [Route 53 routing to an S3 website](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/RoutingToS3Bucket.html)
4. [S3 website endpoints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html)
5. [Connecting to Lightsail PostgreSQL](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-connecting-to-your-postgres-database.html)
6. [PostgreSQL JDBC SSL configuration](https://jdbc.postgresql.org/documentation/ssl/)
7. [Spring Kafka embedded broker support](https://docs.spring.io/spring-kafka/reference/testing.html)
8. [Spring profiles and environment](https://docs.spring.io/spring-framework/reference/core/beans/environment.html)
9. [Spring MVC CORS](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)
10. [Beanstalk Java SE proxy configuration](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/java-se-nginx.html)
11. [Route 53 routing to Beanstalk](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-beanstalk-environment.html)
