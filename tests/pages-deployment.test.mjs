import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const workflowUrl = new URL("../.github/workflows/pages.yml", import.meta.url)

test("Pages deployment waits beyond the official action timeout without cancelling", async () => {
  const workflow = await readFile(workflowUrl, "utf8")

  assert.match(workflow, /id-token:\s*write/)
  assert.match(workflow, /actions\/upload-pages-artifact@/)
  assert.match(workflow, /POST[^\n]*pages\/deployments|pages\/deployments[^\n]*POST/s)
  assert.match(workflow, /pages\/deployments\/\$deployment_id/)
  assert.match(workflow, /timeout-minutes:\s*35/)
  assert.match(workflow, /for attempt in \$\(seq 1 360\)/)
  assert.doesNotMatch(workflow, /actions\/deploy-pages|\/cancel/)
})
