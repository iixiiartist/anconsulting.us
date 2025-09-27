// Netlify Function: version
// Returns deployment commit reference for verification.

exports.handler = async () => {
  const commit = process.env.COMMIT_REF || 'unknown';
  const deployedAt = new Date().toISOString();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commit, deployedAt })
  };
};
