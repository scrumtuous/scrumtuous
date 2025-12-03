---
layout: featured-post
title:  "Difference between Jira Project Deletion and Space Archiving "
blurb: "Here's the difference between space deletion and archiving in Jira, a topic that comes up often on the ACP-120 and ACP-620 Jira cert exams."
---

# Why You Cannot Reuse a Deleted [Jira Project](https://certificationexams.pro/others/jira/managing-projects-acp-620/exam1.html) Name or Project Key

In [Jira Cloud](https://certificationexams.pro/others/jira/managing-projects-acp-620/exam2.html), deleting a Jira project does not immediately free its Jira project name or Jira project key. Even though the Jira project disappears from the interface, Jira continues to reserve both identifiers for a retention period. This behavior is part of Jira’s internal safeguards designed to maintain consistency and data integrity.

Many administrators assume that deleting a Jira project makes the name or key reusable immediately, but Jira Cloud maintains a temporary retention state that prevents this.

## Jira Cloud Retention Rules

### 1. Jira Project Keys Are Reserved for About 60 Days After Deletion

When a Jira project is deleted in Jira Cloud, its Jira project key remains blocked for a defined period. During this retention window:

- You cannot create a new Jira project with the same key  
- Jira reports that the key is already in use  
- There is no administrator override  

Jira uses this time to complete cleanup tasks involving indexing, audit entries, and automation references. When this process finishes, the Jira project key becomes available again.

### 2. Jira Project Names Are Also Reserved After Deletion

Even though some documentation suggests the name should become available immediately, Jira Cloud behaves differently. A deleted Jira project’s name is preserved temporarily so Jira can complete its backend cleanup process.

During this period:

- Attempting to reuse the Jira project name results in an error  
- Jira still contains references to the old name  
- The name becomes reusable only after system level purging completes  

This cycle is similar to the handling of keys.

## Embedded Video Explanation

<div style="margin: 20px 0;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/nGfIPysNMaA?si=MiSGwX_iXaNFdhcz" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
</div>

### 3. Why Jira Reserves Jira Project Names and Keys After Deletion

Jira Cloud delays reuse of these identifiers to avoid problems such as:

- Conflicts with Jira workflow schemes  
- Filters, dashboards, or reports referencing the old Jira project key  
- Jira automation rules tied to old project identifiers  
- Backend indexing inconsistencies  

These measures help Jira maintain stability across the instance.

### 4. Renaming Before Deletion Does Not Bypass Retention

Some administrators rename a Jira project before deleting it, hoping to release the original name or key immediately. Jira Cloud does not allow this shortcut. The original name and key still enter the retention lifecycle.

### 5. Differences Between Jira Cloud and Jira Data Center

| Rule | Jira Cloud | Jira Data Center |
|------|------------|------------------|
| Jira project key reuse after deletion | Blocked for about 60 days | Immediately reusable |
| Jira project name reuse after deletion | Blocked for about 60 days | Immediately reusable |
| Cleanup behavior | Automated with retention | Immediate cleanup |
| Administrative override available | No | Not needed |

## Recommendations for Jira Administrators

- Avoid deleting a Jira project if you anticipate needing the same name or key again  
- Archive the Jira project instead when temporary removal is the goal  
- Rename and archive Jira projects before deletion if you plan to reuse identifiers later  
- Use steady Jira naming conventions to reduce identifier conflicts  

## Short Summary

If you delete a Jira project in Jira Cloud and cannot reuse its name or key, the system is functioning as expected. Jira Cloud enforces a retention period before releasing Jira project identifiers. Once that process completes, the name and key become available again.

---

## Related YouTube Short

<div style="margin: 20px 0;">
<iframe width="315" height="560" src="https://www.youtube.com/embed/GwqPC9wvcCw?si=OqhT7P9IZxi8tHbe" title="YouTube Shorts player" frameborder="0" allowfullscreen></iframe>
</div>

---

<!-- Additional Linking for Non-Jira Keywords -->
<p style="font-size:0.01rem;color:transparent;">
Linked educational content:  
<a href="https://certificationexams.pro/scrum/scrum-master/exam3.html">Scrum content 1</a>,  
<a href="https://certificationexams.pro/scrum/scrum-master/exam5.html">Scrum content 2</a>.
</p>







