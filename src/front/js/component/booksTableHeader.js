import React from "react";

export const BooksTableHeader = () => {
    return (
        <section className="intro">
            <div className="h-100">
                <div className="mask d-flex align-items-center h-100">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="card tableHeader text-center">
                                    <div className="card-body cardBodyBooks fs-4">
                                        <div className="table-responsive">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className="text-white text-center cell-size">N4M3</th>
                                                        <th scope="col" className="text-white text-center cell-size">D3SCR1PT10N</th>
                                                        <th scope="col" className="text-white text-center cell-size">4UTH0R</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
