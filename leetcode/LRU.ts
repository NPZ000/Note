/**
 * LRU
 * 使用过的数据放在最前面
 * 添加数据的时候  如果空间不足 就把最久没使用过的数据清除掉
 */

interface OriginData {
  origin: string;
  lastUsed: number;
  size: number;
  persistent: boolean;
}
interface LRUStorage {
  capacity: number;
  // to use the data for origin
  // return size of the data or undefined if not exist
  getData(origin: string): OriginData | undefined;

  // updating data for origin
  // return boolean to indicate success or failure
  // If the total size exceeds capacity,
  // Least Recently Used non-persistent origin data other than itself should be evicted.
  setData(origin: string, size: number): boolean;
  // manually clear data for origin
  clearData(origin: string): void;
  // change data for origin to be persistent
  // it only handles existing data not the data added later
  // persistent data cannot be evicted unless manually clear it
  makePersistent(origin: string): void;
}


// new Map的底层是一个有序链表，set方法会设置到最前端
//  所以如果要把数据挪到最前面 就先 delete  然后再 set

/**
 * @typedef {object} OriginData
 * @property {string} origin
 * @property {number} lastUsed
 * @property {number} size
 * @property {boolean} persistent
 */

class MyLRUStorage  {
    /**
     * @param {number} capacity
     * @param {() => number} getTimestamp
     */
    capacity: number
    map: Record<string, any>
    totalSize: number
    constructor(capacity) {
      this.capacity = capacity
      this.map = new Map()
      this.totalSize = 0
    }
  
    /**
     * @param {string} origin
     * @returns {OriginData | undefined}
     */
    getData(origin) {
      if (!this.map.has(origin)) {
        return undefined
      }
      const originData = this.map.get(origin)
      // 挪到最前面
      this.map.delete(origin)
      this.map.set(origin, originData)
      return this.map.get(origin)
    }
  
    /**
     * @param {string} origin
     * @param {number} size
     * @returns {boolean}
     */
    setData(origin, size) {
      if (size > this.capacity) {
        return false
      }
      const originData = this.map.get(origin)
      // 本来就有并且新的size小于之前的size 就直接更新
      if (originData && originData.size >= size) {
        originData.size = size
        this.totalSize = this.totalSize - originData.size + size
        if (originData) {
            // 挪到最前面
          this.map.delete(origin)
          this.map.set(origin, originData)
        }
        return true
      } else {
        // 先删除一下能删的
        console.log(Array.from(this.map))
        // 不是需要持久化的数据
        const canDelOrigin = Array.from(this.map).map(item => !item[1].persistent ? item[0] : undefined).filter(Boolean)
        while (this.totalSize + size > this.capacity) {
          console.log(canDelOrigin)
          if (!canDelOrigin.length) {
            // 空间依然不足。但是没有能删的了
            return false
          }
          const key = canDelOrigin.shift()
          this.totalSize -= this.map.get(key).size
          this.map.delete(key)
        }
        
        this.totalSize += size
        this.map.set(origin, {size})
        // 这里重新has判断 因为可能这个key已经被删掉  然后又重新set了
        if (this.map.has(origin)) {
          const originData = this.map.get(origin)
          this.map.delete(origin)
          this.map.set(origin, originData)
        }
        return true
      }
      
    }
  
    /**
     * @param {string} origin
     * @returns {void}
     */
    clearData(origin) {
      this.totalSize -= this.map.get(origin).size
      this.map.delete(origin)
    }
  
    /**
     * @param {string} origin
     * @returns {void}
     */
    makePersistent(origin) {
      const originData = this.map.get(origin)
      if (originData) {
        originData.persistent = true
      }
    }
  }
  
  const a = new MyLRUStorage(10)
  a.setData('x', 1)
  a.setData('b', 3)
  a.setData('c', 6)
  a.setData('c', 10)
  // console.log(a.getData('x'))
  // console.log(a.getData('b').size)
  // console.log(a.getData('c').size)
  
  
  


