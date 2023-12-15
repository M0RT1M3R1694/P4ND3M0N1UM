import React, { useContext, useEffect } from 'react'
import PropTypes from "prop-types"
import { Context } from '../store/appContext'

export const UsersTable = ({ user }, ...props) => {
  const { store, actions } = useContext(Context)

  return (
    <section className="intro">
      <div className="h-100">
        <div className="mask d-flex align-items-center h-100 p-0">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="card tableUsersItems text-center">
                  <div className="card-body cardBodyUsers">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <tbody>
                          <tr>
                            <td className="text-center users-cell-size align-middle fs-5">{user.first_name}</td>
                            <td className="text-center users-cell-size align-middle fs-5">{user.last_name}</td>
                            {/* <td className="text-center users-cell-size align-middle"></td> */}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}
UsersTable.propTypes = {
  user: PropTypes.object
}