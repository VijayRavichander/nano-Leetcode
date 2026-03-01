import { db } from "../index";

const editorials: Record<string, string> = {
  "two-sum": `## Intuition
This stored problem is a direct arithmetic exercise rather than the classic LeetCode hash map problem. The task only asks you to add two non-negative integers and print the result.

## Approach
Read the two integers, return their sum, and print it. There is no search, pairing logic, or extra data structure involved.

## Complexity
- Time: O(1)
- Space: O(1)
`,
  "longest-substring-without-repeating-characters": `## Intuition
You want the longest contiguous window with no duplicate characters. If a duplicate appears, the left side of the window has to move forward until the window is valid again.

## Approach
Use a sliding window with two pointers.

1. Expand the right pointer one character at a time.
2. Track the most recent index of each character.
3. If the current character was already seen inside the active window, move the left pointer to one position after its previous occurrence.
4. Update the best window length after processing each character.

This keeps the window valid while scanning the string only once.

## Complexity
- Time: O(n)
- Space: O(min(n, alphabet))
`,
  "minimum-replacements-make-array-alternating": `## Intuition
To avoid equal adjacent values, the best final array can be viewed as choosing one value for even indices and one value for odd indices, with those two chosen values being different.

## Approach
Count frequencies separately on even positions and odd positions.

1. Build one frequency table for even indices and another for odd indices.
2. Extract the two most frequent candidates from each side.
3. Try the best even choice against the best odd choice.
4. If they are different, use them directly.
5. If they are the same, combine the best even with the second-best odd, and the second-best even with the best odd, then take the smaller replacement count.

The replacement count is:

\`evenSlots - chosenEvenFrequency + oddSlots - chosenOddFrequency\`

## Complexity
- Time: O(n)
- Space: O(u), where u is the number of distinct values
`,
  "reverse-nodes-in-k-group": `## Intuition
The list should only be reversed in complete groups of size \`k\`. That means each step has two parts: first check that a full group exists, then reverse only that segment and reconnect it to the rest of the list.

## Approach
Use pointer manipulation with a dummy head.

1. Keep a pointer to the node just before the current group.
2. Walk forward \`k\` steps to confirm that the next group is complete.
3. Record the node after the group so you know where to reconnect.
4. Reverse the nodes inside the group by standard iterative pointer flipping.
5. Reattach the reversed group and advance to the next group.

If fewer than \`k\` nodes remain, stop immediately and leave them unchanged.

## Complexity
- Time: O(n)
- Space: O(1)
`,
  "merge-k-sorted-lists": `## Intuition
At any moment, the smallest value among all current list heads must be the next value in the merged answer. A min-heap is a natural way to keep track of that choice efficiently.

## Approach
Use a priority queue of current list heads.

1. Push the head of each non-empty list into a min-heap.
2. Repeatedly pop the smallest node.
3. Append it to the merged answer.
4. If the popped node has a next node, push that next node into the heap.
5. Continue until the heap is empty.

This always extracts the globally smallest remaining node and builds the merged sorted list in order.

## Complexity
- Time: O(N log k), where N is the total number of nodes
- Space: O(k)
`,
  "median-of-two-sorted-arrays": `## Intuition
You do not need to fully merge both arrays. Instead, partition them so that the left half contains exactly half of the total elements and every value on the left is less than or equal to every value on the right.

## Approach
Binary search on the smaller array.

1. Assume you cut \`nums1\` at index \`i\`.
2. That determines the cut \`j\` in \`nums2\` so the left partition has the correct size.
3. Check the four border values:
   - left of \`nums1\`
   - right of \`nums1\`
   - left of \`nums2\`
   - right of \`nums2\`
4. If both left borders are less than or equal to the opposite right borders, the partition is valid.
5. Otherwise move the binary search left or right until the partition becomes valid.

Once the partition is correct:
- odd total length: median is the larger left-border value
- even total length: median is the average of the larger left-border value and the smaller right-border value

## Complexity
- Time: O(log(min(m, n)))
- Space: O(1)
`,
};

const slugs = Object.keys(editorials);

const main = async () => {
  for (const slug of slugs) {
    await db.problem.update({
      where: { slug },
      data: { editorial: editorials[slug] },
    });
  }

  const updated = await db.problem.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, editorial: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(
    JSON.stringify(
      {
        updated: updated.map((problem) => ({
          slug: problem.slug,
          hasEditorial: problem.editorial.trim().length > 0,
        })),
      },
      null,
      2
    )
  );
};

try {
  await main();
} finally {
  await db.$disconnect();
}
