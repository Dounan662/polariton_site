# Compare two research approaches

Compare two classification thresholds on a tiny synthetic qubit-readout dataset. You will save a baseline, explore an alternative in a separate node, and collect both results in a comparison workspace.

This exercise demonstrates a research workflow, not a validated readout method. The numbers are invented, and eight samples cannot establish experimental performance.

## Before you start

Follow [getting started](../start/getting-started.md) to launch Polariton and connect a model. Create a new project in a disposable folder and name its initial node **Baseline**. Use one worker per node for this exercise and select **No environment** before each worker’s first message. No Docker or additional capability setup is needed. Model requests use your provider account.

## 1. Analyze the baseline

Send the Baseline worker this prompt, including the CSV:

````text
Create readout.csv with exactly this synthetic data:

```csv
sample,prepared_state,signal
1,0,0.10
2,0,0.20
3,0,0.45
4,0,0.55
5,1,0.52
6,1,0.65
7,1,0.80
8,1,0.90
```

Create analyze.mjs using only Node.js built-in modules. Accept a numeric
threshold argument and read readout.csv from the working directory.
Predict state 1 when signal >= threshold, otherwise state 0.

Write result.json with threshold, samples, correct, accuracy,
false_positives (prepared 0, predicted 1), and false_negatives
(prepared 1, predicted 0). Express accuracy as a fraction from 0 to 1.
Run node analyze.mjs 0.50. Write a short report.md explaining the result
and the limits of this synthetic example. Do not install dependencies.
````

Inspect the files and the worker’s tool activity. You should have `readout.csv`, `analyze.mjs`, `result.json`, and `report.md`. The baseline should classify **7 of 8 samples correctly**, with accuracy **0.875**, **one false positive** (sample 4), and **no false negatives**. Ask the worker to correct any discrepancy before continuing.

## 2. Save the baseline

Wait for file writes to finish, then choose **Publish checkpoint** in the workspace toolbar. Use a note such as “Synthetic readout baseline, threshold 0.50.” Confirm publication succeeded and record the node and checkpoint IDs for later comparison.

A checkpoint includes shared workspace changes, so review the files being retained. Avoid manual Git operations during publication. See [checkpoint semantics](checkpoints.md) for inclusion rules and recovery after an uncertain outcome.

## 3. Explore an alternative

Use **Create node from checkpoint** on the baseline checkpoint and name the new node **Alternative**. Confirm the four files are present. Select or add a worker in this node, then send:

```text
This workspace inherits a synthetic readout baseline. Read readout.csv,
analyze.mjs, and report.md. Keep the data and classification rule unchanged.
Run node analyze.mjs 0.60 to replace result.json, and update report.md
to describe this threshold's result and limitations. Do not install dependencies.
```

Expect **7 correct**, accuracy **0.875**, **no false positives**, and **one false negative** (sample 5). Confirm the Baseline workspace still reports threshold `0.50`. The new node has independent files; it does not inherit the original worker’s conversation or Git history.

Add a research relationship from Alternative to Baseline labeled **compares**, with a description such as “Same synthetic data and rule; threshold changed from 0.50 to 0.60.” This label describes your reasoning; it does not move data or schedule work.

After review, publish the Alternative checkpoint and record its node and checkpoint IDs.

## 4. Bring the results together

Create another node from the baseline checkpoint and name it **Comparison**. Using the workspace toolbar’s system-folder action, open the source and destination folders. With both source workers idle, copy the reviewed files into Comparison:

```text
inputs/
├── baseline/
│   ├── readout.csv
│   ├── analyze.mjs
│   ├── result.json
│   └── report.md
└── alternative/
    ├── readout.csv
    ├── analyze.mjs
    ├── result.json
    └── report.md
```

Copy files; do not move them or copy `.git`. Confirm the source files have not changed since their checkpoints. If they have, retrieve the checkpoint versions before copying. The inherited files at the Comparison workspace root are the baseline starting point; use the explicit `inputs/` folders for the comparison.

Create `sources.md` in Comparison recording each input folder’s source node ID, checkpoint ID, and threshold. Add **compares** relationships from Comparison to both source nodes. These relationships explain the comparison; your explicit copies supply its inputs.

Send the Comparison worker:

```text
Read sources.md and both inputs/ folders. Check that the CSV data and
analysis code match between the two inputs. Independently recompute the
classifications at thresholds 0.50 and 0.60 from the CSV and compare them
with the saved result.json files. Do not modify the source inputs.

Write comparison.md with a result table, the misclassified sample IDs,
links to the local input files and sources.md, and a short interpretation.
Explain whether either threshold is better on this fixture and what
additional evidence a real experiment would need. Report any mismatch.
```

Check the resulting table:

| Threshold | Correct | Accuracy | False positives | False negatives |
| --- | --- | --- | --- | --- |
| 0.50 | 7 / 8 | 87.5% | 1 | 0 |
| 0.60 | 7 / 8 | 87.5% | 0 | 1 |

Neither threshold improves accuracy on this fixture. The error type changes; choosing between them requires a research objective, an error-cost model, and more representative data. A report that claims a generally superior threshold is not supported by this exercise.

Review `comparison.md`, then publish a Comparison checkpoint to retain the inputs, source references, and report together.

## 5. Revisit the evidence

Start from the Comparison node. Follow its relationships to understand the research directions, use `sources.md` to identify the source checkpoints, and inspect each worker’s conversation and trajectory to see the recorded analysis steps. Compare retained checkpoint contents when current files have changed.

These records complement one another; a checkpoint is not a synchronized snapshot of graph history and worker conversations. See [research provenance](provenance.md) for their boundaries, and [storage and backups](storage.md) to preserve the complete project.
