import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Poster from './Poster'

const renderList = (list, compact) => {
  const { listID, posters, subject, listedBy, filmCount, description } = list
  const url = `/list/${listID}`
  const row = classNames({ row: !compact })
  const col4 = classNames({ 'col-md-4': !compact })
  const col8 = classNames({ 'col-md-8': !compact })
  const text = `${filmCount} ${filmCount === 1 ? 'film' : 'films'} listed by ${listedBy}`
  const offset = description.indexOf('\n')
  const brief = offset < 0 ? description : description.slice(0, offset)

  return (
    <li className="my-3" key={listID}>
      <div className={row}>
        <div className={col4}>
          <div className="row no-gutters mb-2">
            {[0, 1, 2, 3, 4].map(i => (
              <div className="col" key={i}>
                {posters[i] &&
                  <Link to={url}>
                    <Poster poster={posters[i]} crop />
                  </Link>
                }
              </div>
            ))}
          </div>
        </div>
        <div className={col8}>
          {compact ? (
            <h6 className="mb-0">
              <Link to={url} className="link">{subject}</Link>
            </h6>
          ) : (
            <h5 className="mb-0">
              <Link to={url} className="link">{subject}</Link>
            </h5>
          )}
          <small className="text-muted">{text}</small>
          {!compact &&
            <div>{brief}</div>
          }
        </div>
      </div>
    </li>
  )
}

const Lists = ({ lists, compact }) => (
  <ul className="list-unstyled">
    {lists.map(list => renderList(list, compact))}
  </ul>
)

Lists.propTypes = {
  lists: PropTypes.arrayOf(PropTypes.shape({
    listID: PropTypes.string,
    posters: PropTypes.array,
    listedBy: PropTypes.string,
    filmCount: PropTypes.number,
    description: PropTypes.string,
  })).isRequired,
  compact: PropTypes.bool,
}

Lists.defaultProps = {
  compact: false,
}

export default Lists
