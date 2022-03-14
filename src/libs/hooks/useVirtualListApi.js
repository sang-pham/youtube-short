import React, { useEffect, useState, useRef, useCallback } from 'react'
import { axiosAuth } from '../utils'
import { useFocusEffect } from '@react-navigation/native';
import { NUMBER_OF_ROW } from '../utils';

export function useVirtualListApi(route, fetchCallback) {
  const [pageData, setPageData] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [loading, setLoading] = useState(false);
  const [max, setMax] = useState(false);

  useEffect(() => {
    if (!max && !currentRow) {
      fetchData();
      console.log('fetch data');
    }
  }, [])

  const fetchData = useCallback(async () => {
    const fetch = async () => {
      try {
        if (max) return;

        console.log(currentRow)

        const res = await axiosAuth.get(route, {
          params: {
            current: currentRow,
            per_page: NUMBER_OF_ROW
          }
        });

        if (res.data.current === res.data.total) {
          setMax(true);
        }

        setCurrentRow(res.data.current);
        setPageData(res.data.messages);
        fetchCallback && fetchCallback(res.data.messages);

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }

    }

    setLoading(true);

    await fetch();

  }, [currentRow, route])




  return { pageData, fetchData, loading, max }
}
