def singleNum(nums):
    ones = 0
    twos = 0
    for num in nums:
        print('before', ones, twos, num)
        ones = ones ^ num & ~twos
        print('in', ones, twos, num)
        twos = twos ^ num & ~ones
        print(ones, twos)
    return ones
singleNum([3,3,3,5])