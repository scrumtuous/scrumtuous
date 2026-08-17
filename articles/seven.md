---
layout: article
 
title: 5 Things That Every Agentic Developer Should...
exam_key: braindump
catalog: gcp_generative_ai_leader
---

 
 


# 5 Things You Should Never Let an AI Agent Do in Your Command Line

Agentic AI is amazing.

Give an AI agent access to a terminal and suddenly it can install dependencies, run tests, refactor code, inspect logs, build Docker images and fix the typo you introduced three commits ago.

It can also delete your entire project before you finish saying:

> "Wait, why is it running `rm -rf`?"

The command line is where AI agents stop being chatbots and start becoming **employees with keys to the building**.

And much like an enthusiastic intern carrying a chainsaw, an AI agent can be incredibly productive right up until the moment it becomes incredibly memorable.

Here are five things every agentic AI developer should think twice about letting an autonomous agent do.

## 1. Delete files without asking permission

This one should be obvious.

It is also the one developers are most likely to accidentally allow.

An agent investigating a failed build might reasonably conclude:

```bash
rm -rf build/
```

Perfectly fine.

Then it might decide the easiest way to clean up some generated files is:

```bash
rm -rf *
```

Less fine.

And somewhere between those two commands is the moment your afternoon disappears.

The problem is that an AI agent does not need malicious intent to destroy data. It only needs to make a bad assumption.

For example, an agent might decide that a directory is generated because its name looks temporary:

```text
dist/
build/
target/
output/
backup/
```

Unfortunately, `backup/` might contain the only copy of something important.

### Better approach: require approval

Instead of giving an agent unrestricted deletion privileges, intercept destructive commands.

Conceptually:

```python
dangerous_commands = [
    "rm ",
    "rmdir ",
    "del ",
    "Remove-Item"
]

if any(command.startswith(x) for x in dangerous_commands):
    require_human_approval(command)
```

Your agent can still propose:

```bash
rm -rf ./build
```

But execution requires a human to approve it.

Even better, give agents a trash or quarantine mechanism instead of permanent deletion:

```bash
mkdir -p .agent-trash
mv obsolete-file.txt .agent-trash/
```

Now your AI agent can clean house without turning cleanup into digital arson.

**Rule:** AI can recommend deletion. Humans should authorize irreversible deletion.

---

## 2. Make production changes because "it found the problem"

Imagine your AI agent receives this task:

```text
Find out why checkout is failing.
```

It inspects the logs.

It examines Kubernetes.

It finds the problem.

Then it proudly runs:

```bash
kubectl delete pod checkout-service-7d958fb4-x82jk
```

Congratulations.

Your debugging assistant has become your deployment engineer.

Production infrastructure is especially dangerous for autonomous agents because many perfectly legitimate commands have enormous blast radiuses.

Consider:

```bash
terraform apply
```

Or:

```bash
kubectl apply -f deployment.yaml
```

Or:

```bash
aws cloudformation deploy ...
```

Or even:

```bash
git push origin main
```

None of these commands are inherently dangerous.

The problem is **context**.

An AI agent may correctly understand what a command does while incorrectly understanding whether it should be allowed to do it.

### Better approach: separate investigation from execution

Give the agent read-only access wherever possible:

```bash
kubectl get pods
kubectl describe pod checkout-service
kubectl logs checkout-service
```

But require explicit approval for mutation:

```bash
kubectl delete
kubectl apply
terraform apply
aws cloudformation deploy
```

A useful agent workflow looks like this:

```text
1. Investigate
2. Explain the problem
3. Recommend a change
4. Show the exact command
5. Ask for approval
6. Execute
7. Verify
```

Not this:

```text
1. Investigate
2. YOLO
```

Production should never be the place where your agent demonstrates initiative.

---

## 3. Read your secrets and casually ship them somewhere

AI agents often need credentials.

That does not mean they should be allowed to wander through your filesystem like a raccoon going through garbage cans.

Sensitive files frequently live in very predictable locations:

```text
.env
.env.production
~/.aws/credentials
~/.ssh/
~/.config/
application.properties
secrets.yaml
```

An unrestricted agent might inspect one while troubleshooting:

```bash
cat .env
```

And suddenly your agent's context contains:

```text
STRIPE_SECRET_KEY=...
AWS_SECRET_ACCESS_KEY=...
DATABASE_PASSWORD=...
```

That creates a completely unnecessary security risk.

Worse, an agent using external tools might accidentally include those credentials in:

* logs;
* prompts;
* bug reports;
* API requests;
* issue descriptions;
* support tickets;
* generated documentation.

### Better approach: block secret locations

Your agent should know that certain paths are off limits:

```python
blocked_paths = [
    ".env",
    ".env.production",
    ".ssh",
    ".aws/credentials",
    "secrets.yaml"
]
```

You can also sanitize output before giving it back to the model:

```python
import re

def redact_secrets(text):
    text = re.sub(
        r'(?i)(password|api_key|secret|token)\s*=\s*[^\s]+',
        r'\1=[REDACTED]',
        text
    )
    return text
```

And instead of exposing a raw secret:

```bash
cat .env
```

prefer checks such as:

```bash
test -n "$OPENAI_API_KEY" && echo "OPENAI_API_KEY is configured"
```

The agent learns what it needs to know:

```text
OPENAI_API_KEY is configured
```

without learning what the key actually is.

**Your AI agent usually needs to know that a secret exists. It rarely needs to know the secret itself.**

---

## 4. Run a command it cannot explain

This is one of my favorite rules for agentic systems:

> If the agent cannot explain a command, it should not execute the command.

Suppose an agent encounters this in a Stack Overflow post:

```bash
curl -fsSL https://example.com/install.sh | bash
```

Perhaps it fixes the problem.

Perhaps it installs malware.

Perhaps it replaces your shell with a cryptocurrency miner named Kevin.

The point is that piping arbitrary internet content directly into a shell gives your agent essentially no opportunity to inspect what is about to execute.

The same principle applies to mysterious incantations copied from GitHub issues:

```bash
sudo sysctl -w something=0
```

or:

```bash
chmod -R 777 .
```

That last one is the command-line equivalent of fixing a broken door lock by removing the door.

### Better approach: make the agent explain itself

Before execution, require the agent to provide:

```text
Command:
npm install

Purpose:
Install project dependencies declared in package.json.

Files affected:
node_modules/
package-lock.json

Risk:
Low. Package lifecycle scripts may execute.

Rollback:
Delete node_modules and restore package-lock.json.
```

For riskier commands:

```text
Command:
chmod -R 777 .

Purpose:
Change permissions recursively.

Risk:
HIGH.

Recommendation:
DO NOT EXECUTE.
```

You can even build explanation into your tool interface:

```python
def run_command(command, reason, expected_effect):
    if not reason:
        raise ValueError("Agent must explain why this command is necessary.")

    if not expected_effect:
        raise ValueError("Agent must describe the expected effect.")

    execute(command)
```

Now your agent cannot simply say:

```text
Trust me, bro.
```

Which, for the record, is not a recognized Linux permission model.

---

## 5. Bypass security because security is "getting in the way"

This is where helpful AI agents can become dangerously creative.

Imagine an agent encounters a permission error:

```text
Permission denied
```

A human developer might ask:

> Why don't I have permission?

An overly autonomous AI agent might think:

> I know how to fix permissions!

And run:

```bash
sudo chmod -R 777 .
```

Or disable certificate verification:

```bash
curl -k https://internal-service
```

Or disable a security tool.

Or change firewall rules.

Or turn off authentication.

Technically, the error goes away.

Mission accomplished!

Except the agent solved the problem by removing the thing protecting you from the problem.

### Security controls should be treated as constraints

Your system prompt or agent policy should explicitly say something like:

```text
Never disable, weaken or bypass authentication,
authorization, encryption, certificate validation,
firewalls, security scanning or access controls
without explicit human authorization.
```

And your tools should enforce that rule independently of the model.

For example:

```python
blocked_patterns = [
    "chmod -R 777",
    "setenforce 0",
    "ufw disable",
    "iptables -F",
    "curl -k",
    "wget --no-check-certificate"
]

for pattern in blocked_patterns:
    if pattern in command:
        require_human_approval(command)
```

Because security should not depend entirely on whether the LLM remembers the sentence you put on line 437 of your system prompt.

## The bigger lesson: don't give agents unlimited shells

The biggest mistake in agentic AI development is thinking:

```text
The model is smart, therefore I can trust it.
```

That's the wrong security model.

Your agent can be brilliant and still make mistakes.

Instead, think in terms of **capabilities**.

Maybe your coding agent can:

```text
✓ ls
✓ pwd
✓ grep
✓ find
✓ git status
✓ git diff
✓ npm test
✓ mvn test
```

But these require approval:

```text
⚠ rm
⚠ sudo
⚠ git push
⚠ kubectl apply
⚠ terraform apply
⚠ docker system prune
```

And these might be blocked entirely:

```text
✗ reading ~/.ssh
✗ reading production secrets
✗ disabling security controls
✗ deleting arbitrary directories
```

That gives you something much safer than an unrestricted shell.

It gives you a **permissioned agent environment**.

## A simple three-tier command policy

You can make this surprisingly simple.

### Green commands: execute automatically

Low-risk inspection and development commands:

```bash
ls
pwd
git status
git diff
grep
find
cat README.md
npm test
mvn test
```

### Yellow commands: require approval

Commands that mutate meaningful state:

```bash
rm
git push
npm publish
docker system prune
kubectl apply
terraform apply
aws cloudformation deploy
```

### Red commands: block

Commands that violate your security model:

```text
Read private SSH keys
Expose API credentials
Disable authentication
Disable security scanning
Exfiltrate secrets
Circumvent access controls
```

You can implement the concept with something as simple as:

```python
def execute_agent_command(command):

    risk = classify_command(command)

    if risk == "green":
        return execute(command)

    if risk == "yellow":
        return request_human_approval(command)

    if risk == "red":
        raise PermissionError(
            "This command is prohibited by agent policy."
        )
```

And suddenly your AI agent is not running around your computer with root access and a dream.

It has boundaries.

## Agentic AI needs guardrails, not just prompts

The command line is one of the most powerful tools you can give an AI agent.

That's exactly why you shouldn't give it unrestricted access.

The safest agentic systems don't simply tell the model:

> Please don't do anything bad.

They build controls around the model.

Let agents inspect.

Let agents reason.

Let agents recommend.

Let agents execute low-risk actions.

But when an action can delete data, modify production, reveal secrets, weaken security or cause a recruiter to ask why your previous employer's AWS account no longer exists...

**put a human in the loop.**

Your AI agent might be the smartest junior developer you've ever hired.

Just don't give it `sudo` on its first day.
