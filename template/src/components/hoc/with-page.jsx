import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { Spin } from 'antd';

/**
 * 页面装饰器
 *
 * 组装 router/store/loading 等
 * 
 * @param {React.ElementType} Component - 被装饰的组件
 * @returns {React.ReactNode} - 被装饰的组件
 */
function WithPage(Component) {
  return (props) => {
    // status
    const [loading, setLoading] = useState(false);

    // WithPageProps
    const withPageProps = {
    // store
      dispatch: useDispatch(),
      useSelector: useSelector,

      // router
      location: useLocation(),
      navigate: useNavigate(),
      params: useParams(),

      // loading
      setLoading: setLoading
    }

    return (
      <Spin spinning={loading}>
        <Component
          {...props}
          {...withPageProps}
        />
      </Spin>
    )
  }
}

export default WithPage