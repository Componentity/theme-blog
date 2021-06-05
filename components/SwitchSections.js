import Posts from './Posts'
export default function SwitchSections(name, slug, type, type_id, posts, sectionType) {
  switch (sectionType) {
    case 'typeOne':
      return (
        <Posts
          key={Math.random().toString(36).substring(7)}
          name={name}
          slug={slug}
          type={type}
          type_id={type_id}
          posts={posts}
        />
      )
      break
    case 'typeTwo':
      return (
        <Posts
          key={Math.random().toString(36).substring(7)}
          name={name}
          slug={slug}
          type={type}
          type_id={type_id}
          posts={posts}
        />
      )
      break

    default:
      return (
        <Posts
          key={Math.random().toString(36).substring(7)}
          name={name}
          slug={slug}
          type={type}
          type_id={type_id}
          posts={posts}
        />
      )
      break
  }
}
