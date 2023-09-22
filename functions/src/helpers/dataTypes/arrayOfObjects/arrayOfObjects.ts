class ArrayOfObjects {
   public static objectsWithVal<T>(array: T[], propertyValue: T[keyof T]): T[] | undefined {
      const obj = array.filter((item) => {
         for (const key in item) {
            if (item[key] === propertyValue) {
               return item;
            }
         }
      });
      if (obj.length === 0) {
         return undefined;
      }
      return obj;
   }

   static objectWithVal<T>(
      array: T[],
      propertyValue: T[keyof T],
   ): T | undefined | { error: string } {
      const object = this.objectsWithVal(array, propertyValue);
      if (object === undefined) return undefined;
      if (object.length > 1) {
         return {
            error: `Internal Server: Multiple Objects Found With Val: ${propertyValue}.`,
         };
      }
      return object[0];
   }
}

export default ArrayOfObjects;
