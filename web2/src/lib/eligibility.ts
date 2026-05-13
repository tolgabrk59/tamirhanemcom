interface EligibilityResult {
  [campaignId: number]: { eligible: boolean }
}

export async function fetchCampaignEligibility(
  campaignIds: number[],
  jwt: string
): Promise<EligibilityResult> {
  const ids = campaignIds.slice(0, 20)
  const results = await Promise.allSettled(
    ids.map(id =>
      fetch(`/api/wash-home-campaigns/${id}/eligibility`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
        .then(r => r.json())
        .then(data => ({ id, eligible: data?.eligible === true || data?.data?.eligible === true }))
        .catch(() => ({ id, eligible: true }))
    )
  )
  const out: EligibilityResult = {}
  for (const r of results) {
    if (r.status === 'fulfilled') {
      out[r.value.id] = { eligible: r.value.eligible }
    }
  }
  return out
}
