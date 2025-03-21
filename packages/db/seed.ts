// Add these PAYLOAD 
// {
//     "problemInfo": {
//         "metaData": {
//             "title": "Search in Rotated Sorted Array",
//             "description": "Given a rotated sorted array and a target value, return the index of the target if found, otherwise return -1. You must write an algorithm with O(log n) runtime complexity.",
//             "difficulty": "Medium",
//             "constraints": [
//                 "1 <= nums.length <= 5000",
//                 "-10^4 <= nums[i] <= 10^4",
//                 "All values of nums are unique.",
//                 "nums is guaranteed to be rotated at some pivot.",
//                 "-10^4 <= target <= 10^4"
//             ],
//             "tags": [
//                 "Binary Search",
//                 "Array"
//             ]
//         },
//         "slug": "search-rotated-sorted-array",
//         "type": "None",
//         "solved": 0,
//         "testCases": [
//             {
//                 "input": "7 4 5 6 7 0 1 2 0",
//                 "output": "4",
//                 "explanation": "Target 0 is found at index 4."
//             },
//             {
//                 "input": "7 4 5 6 7 0 1 2 3",
//                 "output": "-1",
//                 "explanation": "Target 3 is not in the array."
//             }
//         ],
//         "sampleTestCase": [
//             {
//                 "input": "nums = [4,5,6,7,0,1,2], target = 0",
//                 "output": "4"
//             },
//             {
//                 "input": "nums = [1], target = 0",
//                 "output": "-1"
//             }
//         ],
//         "functionCode": {
//             "cpp": "int search(vector<int>& nums, int target) { \n    // Implementation goes here \n    return result; \n}"
//         }
//     },
//     "problemId": "cm8j7oaov0002silrk5er8pxx",
//     "code": {
//         "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\n##USER_CODE_HERE##\n\nint main() {\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) {\n        cin >> nums[i];\n    }\n    cin >> target;\n    int result = search(nums, target);\n    cout << result;\n    return 0;\n}"
//     },
//     "testCases": [
//         {
//             "input": "7 4 5 6 7 0 1 2 0",
//             "output": "4"
//         },
//         {
//             "input": "7 4 5 6 7 0 1 2 3",
//             "output": "-1"
//         },
//         {
//             "input": "1 1 0",
//             "output": "-1"
//         },
//         {
//             "input": "6 3 5 1 2 6 7 5",
//             "output": "1"
//         }
//     ]
// }
