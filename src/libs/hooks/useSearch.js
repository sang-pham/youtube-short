import React, { useCallback, useEffect, useState } from 'react'
import { axiosAuth } from '../utils';
import _ from 'lodash'

function useSearch(route) {
  const [text, setText] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    searchDebounceFn(text);
  }, [text])

  const searchDebounceFn = useCallback(_.debounce(async (search) => {
    if (search) {
      const response = await axiosAuth.get(route, {
        params: {
          text: search
        }
      })

      setSearchData(response.data.users);
    } else {
      setSearchData([]);
    }

    setSearchLoading(false);
  }, 200)
    , [route]);

  const handleSearch = (search) => {
    setSearchLoading(true);
    setText(search)
  }

  const clear = () => {
    setText('');
    setSearchLoading(false);
    setSearchData([]);
  }



  return { searchData, searchLoading, handleSearch, clear };
}

export { useSearch }