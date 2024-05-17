export const customSort = (timeList: any, direction: number) => {
  const compareTime = (time1: string, time2: string) => {
    const date1 = new Date(
      time1.replace(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/, "$3-$2-$1T$4:$5")
    );
    const date2 = new Date(
      time2.replace(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/, "$3-$2-$1T$4:$5")
    );

    if (direction === 1) {
      return date1.getTime() - date2.getTime();
    } else if (direction === -1) {
      return date2.getTime() - date1.getTime();
    }
  };

  return timeList.sort(compareTime);
};
