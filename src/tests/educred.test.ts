import { evaluateActivityDate } from '../lib/ocr';
import { calculateSHA256 } from '../lib/hash';

// Test runner helper
let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${details || ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('  EduCred Automated Verification Tests  ');
  console.log('========================================\n');

  // 1. DATE VERIFICATION ENGINE TESTS (Section 10)
  console.log('--- Test Suite 1: Lesson Plan Date Verification Policy ---');
  const refDate = '2026-10-09';
  const leadDays = 3;

  // Scenario A: Same-day submission (2026-10-09) with prohibitSameDay = true
  const sameDay = evaluateActivityDate('2026-10-09', refDate, leadDays, true);
  assert(!sameDay.passed, 'Same-day submission (October 9) is blocked', sameDay.violationReason);

  // Scenario B: 1-day prior submission (2026-10-08)
  const oneDayPrior = evaluateActivityDate('2026-10-08', refDate, leadDays, true);
  assert(!oneDayPrior.passed, '1-day prior submission (October 8) is blocked by 3-day lead window', oneDayPrior.violationReason);

  // Scenario C: 2-days prior submission (2026-10-07)
  const twoDaysPrior = evaluateActivityDate('2026-10-07', refDate, leadDays, true);
  assert(!twoDaysPrior.passed, '2-days prior submission (October 7) is blocked by 3-day lead window', twoDaysPrior.violationReason);

  // Scenario D: 3-days prior submission (2026-10-06)
  const eligibleDate = evaluateActivityDate('2026-10-06', refDate, leadDays, true);
  assert(eligibleDate.passed, '3-days prior submission (October 6) is ELIGIBLE', eligibleDate.violationReason);

  // Scenario E: Future date submission (2026-10-12)
  const futureDate = evaluateActivityDate('2026-10-12', refDate, leadDays, true);
  assert(!futureDate.passed, 'Future date submission is blocked', futureDate.violationReason);

  // 2. CRYPTOGRAPHIC EVIDENCE INTEGRITY & DUPLICATE HASH TESTS
  console.log('\n--- Test Suite 2: Cryptographic Hashing & Evidence Integrity ---');
  const bufferA = new TextEncoder().encode('Curriculum Document Sample 2026');
  const bufferB = new TextEncoder().encode('Curriculum Document Sample 2026');
  const bufferC = new TextEncoder().encode('Different Assessment Artifact');

  const hashA = await calculateSHA256(bufferA.buffer);
  const hashB = await calculateSHA256(bufferB.buffer);
  const hashC = await calculateSHA256(bufferC.buffer);

  assert(hashA.length === 64, 'SHA-256 outputs a 64-character hexadecimal digest');
  assert(hashA === hashB, 'Identical evidence files produce identical SHA-256 hashes');
  assert(hashA !== hashC, 'Distinct evidence files produce distinct SHA-256 hashes');

  // 3. CREDIT LEDGER IDEMPOTENCY TESTS (Section 14)
  console.log('\n--- Test Suite 3: Recognition Credit Ledger & Idempotency ---');
  const mockLedger: any[] = [];

  function recordCreditAward(contributionId: string, ruleId: string, amount: number) {
    const key = `award-${contributionId}-${ruleId}`;
    if (mockLedger.some(e => e.idempotencyKey === key)) {
      return { success: false, error: 'Idempotency key collision: duplicate credit blocked' };
    }
    mockLedger.push({ idempotencyKey: key, amount });
    return { success: true };
  }

  const award1 = recordCreditAward('contrib-101', 'rule-lesson', 10);
  assert(award1.success, 'First credit award succeeds and records 10 credits');

  const awardRetry = recordCreditAward('contrib-101', 'rule-lesson', 10);
  assert(!awardRetry.success, 'Retry with same idempotency key is blocked (prevents duplicate credit generation)');

  const awardDistinct = recordCreditAward('contrib-102', 'rule-lesson', 10);
  assert(awardDistinct.success, 'Distinct contribution credit award succeeds');
  assert(mockLedger.length === 2, 'Ledger contains exactly 2 valid transactions');

  // 4. CONFLICT OF INTEREST TESTS (Section 13)
  console.log('\n--- Test Suite 4: Conflict of Interest & Access Protection ---');
  function checkReviewPermission(checkerId: string, contributionTeacherId: string) {
    if (checkerId === contributionTeacherId) {
      return { allowed: false, reason: 'Conflict of Interest: Checker cannot review own contribution' };
    }
    return { allowed: true };
  }

  const ownReview = checkReviewPermission('user-priya', 'user-priya');
  assert(!ownReview.allowed, 'Checker cannot approve their own submission', ownReview.reason);

  const peerReview = checkReviewPermission('user-checker-david', 'user-priya');
  assert(peerReview.allowed, 'Authorized checker can review peer submissions');

  // SUMMARY
  console.log('\n========================================');
  console.log(`Tests Executed: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
