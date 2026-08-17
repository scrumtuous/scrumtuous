---
layout: article
 
title: Globbing, Grepping, Aliases
exam_key: braindump
catalog: gcp_generative_ai_leader
---



# Globbing, Grepping, and Aliases

## What is globbing?

**Globbing** is the process of matching filenames or paths using wildcard patterns. It is commonly used in Linux and Unix shells to select multiple files at once.

For example:

```bash
ls *.txt
```

The `*` wildcard matches any number of characters, so this command lists every file ending in `.txt`.

## What is grep?

The **grep** command searches text for specific words, phrases, or patterns and displays the matching lines.

For example:

```bash
grep -i "hello" gag.txt
```

The `-i` option makes the search case-insensitive, so it matches `hello`, `Hello`, `HELLO`, and other variations.

## How is globbing different from grep?

**Grep** searches the contents of text using patterns, including regular expressions.

**Globbing** matches filenames and paths using shell wildcards.

Another important difference is that `grep` is a command, while globbing is a feature provided by the shell and can be used with many different commands.

For example:

```bash
grep "error" *.log
```

Here:

- `grep` searches for the word `error`.
- `*.log` uses globbing to select all files ending in `.log`.

## Globbing syntax and examples

### Match any number of characters with `*`

```bash
ls *.txt
```

This lists all files ending in `.txt`.

Examples that would match:

```text
notes.txt
hello.txt
report.txt
```

### Match one character with `?`

```bash
ls hello?.txt
```

The `?` wildcard matches exactly one character.

This could match:

```text
hello1.txt
helloA.txt
hellox.txt
```

But it would not match:

```text
hello.txt
hello12.txt
```

You could also use globbing with commands such as `rm`:

```bash
rm hello?.txt
```

This removes files beginning with `hello`, followed by exactly one character, and ending in `.txt`.

## What are aliases?

An **alias** lets you create a short command that represents a longer command or sequence of commands.

For example, imagine Tiffany is writing a document and uses `TODO` to mark tasks she still needs to complete. Once the document is finished, she wants to remove every occurrence of `TODO`.

She could create an alias:

```bash
alias alldone="sed -i 's/TODO//g' file.txt"
```

Now she can simply run:

```bash
alldone
```

instead of typing the full `sed` command every time.

To see your currently defined aliases, run:

```bash
alias
```

You can also create simple shortcuts such as:

```bash
alias ll="ls -la"
```

Then:

```bash
ll
```

runs:

```bash
ls -la
```
