import React, {useEffect, useState, useRef} from 'react'
import { axiosAuth } from '../utils'

const NUMBER_ROW = 20;

export function useVirtualListApi(route) {
  const [pagedata, setPageData] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const pendding = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      pendding.current = true;
      const res = await axiosAuth.get(route, {
        params: {
          current: currentRow,
          per_page: NUMBER_ROW
        }
      });
  
      pendding.current = false;
      setCurrentPage(res.data.current)
      setPageData(res.data.data);

    } catch (error) {
      pendding.current = false;
      console.log(error);
    }

  }, [currentRow]) 

  useEffect(() => {
    fetchData();
  }, [])


  return {pagedata, fetchData, loading: pendding.current}
}
